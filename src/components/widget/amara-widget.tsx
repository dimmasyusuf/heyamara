"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BotIcon, TrashIcon, XIcon } from "lucide-react";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  CHAT_KEY,
  useCreateChatSession,
  useDeleteChatSession,
  useGetChatSession,
} from "@/services/chat";
import blobAnimation from "@/assets/lottie/blob.json";
import Lottie from "lottie-react";
import { useWidgetStore } from "@/stores/widget";
import { useParams, usePathname } from "next/navigation";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { ChatMessage } from "@prisma/client";
import { streamChat } from "@/actions/chat";

const WIDGET_TYPES = {
  CANDIDATE: "AMARA_WIDGET_CANDIDATE",
} as const;

const FormSchema = z.object({
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
});

export default function AmaraWidget() {
  const { project_id, document_id, analysis_id } = useParams<{
    project_id: string;
    document_id: string;
    analysis_id: string;
  }>();

  const { open, setOpen } = useWidgetStore();

  // Close widget on route change
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Main state - using Prisma types with additional UI state
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<
    (ChatMessage & {
      isLoading?: boolean;
      isStreaming?: boolean;
      isNewMessage?: boolean;
    })[]
  >([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(".");

  // Refs for managing streaming state
  const isStreamingRef = useRef(false);
  const startStreamingRef = useRef<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // API hooks
  const {
    data: chatData,
    isLoading: isLoadingChat,
    refetch: refetchChat,
  } = useGetChatSession(chatId as string, {
    queryKey: CHAT_KEY.GET_CHAT_SESSION(chatId),
    enabled: !!chatId,
  });

  const { mutateAsync: createChat, isPending: isCreatingChat } =
    useCreateChatSession();
  const { mutateAsync: deleteChat, isPending: isDeletingChat } =
    useDeleteChatSession();

  // Form setup
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { message: "" },
  });

  // Helper functions
  const getCookieKey = useCallback(() => WIDGET_TYPES.CANDIDATE, []);
  const getExistingChatId = useCallback(
    () => Cookies.get(getCookieKey()),
    [getCookieKey],
  );

  const createDefaultGreeting = useCallback(
    (): ChatMessage & {
      isLoading?: boolean;
      isStreaming?: boolean;
      isNewMessage?: boolean;
    } => ({
      id: `bot-${nanoid()}`,
      type: "CANDIDATE",
      role: "ASSISTANT",
      content: `Hi! 👋🏻\nHow can I help you today?`,
      chatSessionId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isLoading: false,
      isStreaming: false,
      isNewMessage: false,
    }),
    [],
  );

  // Chat management functions
  const handleCreateChat = useCallback(
    async (userMessage?: string): Promise<string | null> => {
      try {
        const response = await createChat({
          type: "CANDIDATE",
          message: userMessage || "New chat",
        });

        if (response?.data?.id) {
          const cookieKey = getCookieKey();
          Cookies.set(cookieKey, response.data.id);
          setChatId(response.data.id);
          return response.data.id;
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
      return null;
    },
    [createChat, getCookieKey],
  );

  const handleClearChat = async () => {
    try {
      // If there's an existing chat, delete it
      if (chatId) {
        await deleteChat(chatId);
      }

      // Clear cookie and reset state
      Cookies.remove(getCookieKey());
      setChatId(null);

      // Reset to default greeting immediately and keep initialized
      setChats([createDefaultGreeting()]);
      setIsInitialized(true);

      // Refetch chat data to ensure UI is up to date
      refetchChat();
    } catch (error) {
      console.error("Failed to clear chat:", error);
      // Even if delete fails, reset the UI
      Cookies.remove(getCookieKey());
      setChatId(null);
      setChats([createDefaultGreeting()]);
      setIsInitialized(true);

      // Refetch chat data even on error
      refetchChat();
    }
  };

  // Initialize widget with default greeting
  const initializeWidget = useCallback(() => {
    const existingChatId = getExistingChatId();

    if (existingChatId) {
      // Load existing chat
      setChatId(existingChatId);
      setIsInitialized(false); // Will be set to true when chat data loads
    } else {
      // Show default greeting, no chat created yet
      setChats([createDefaultGreeting()]);
      setIsInitialized(true);
    }
  }, [getExistingChatId, createDefaultGreeting]);

  // Streaming message handler using streamChat action
  const handleStreamingMessage = useCallback(
    async (
      userMessage: string,
      botMessageId: string,
      currentChatId: string,
    ) => {
      setIsStreaming(true);
      isStreamingRef.current = true;
      startStreamingRef.current = userMessage;

      try {
        const content = await streamChat({
          message: userMessage,
          chat_id: currentChatId,
          type: "CANDIDATE",
        });

        // Update the bot message with the result
        setChats((currentChats) =>
          currentChats.map((chat) =>
            chat.id === botMessageId
              ? {
                  ...chat,
                  content:
                    (typeof content === "string" && content) ||
                    "Sorry, I couldn't process your request.",
                  isLoading: false,
                  isStreaming: false,
                  isNewMessage: false,
                }
              : chat,
          ),
        );
      } catch (error) {
        console.error("Streaming error:", error);

        // Handle error and stop both loading and streaming
        setChats((currentChats) =>
          currentChats.map((chat) =>
            chat.id === botMessageId
              ? {
                  ...chat,
                  content:
                    "Sorry, I encountered an error while processing your request.",
                  isLoading: false,
                  isNewMessage: false,
                  isStreaming: false,
                }
              : chat,
          ),
        );
      } finally {
        isStreamingRef.current = false;
        startStreamingRef.current = null;
        setIsStreaming(false);
        // Refetch chat data after streaming completes
        refetchChat();
      }
    },
    [refetchChat],
  );

  // Check for new messages that need streaming
  const checkForNewMessage = useCallback(async () => {
    const newBotMessage = chats.find(
      (chat) =>
        chat.isNewMessage && chat.role === "ASSISTANT" && chat.isLoading,
    );

    if (!newBotMessage || isStreamingRef.current) return;

    const botIndex = chats.findIndex((chat) => chat.id === newBotMessage.id);
    if (botIndex <= 0) return;

    const userMessage = chats[botIndex - 1];
    if (!userMessage || userMessage.role !== "USER") return;

    const messageText = userMessage.content.trim();
    if (!messageText || startStreamingRef.current === messageText) return;

    // Get or create chat ID
    let currentChatId = chatId;
    if (!currentChatId) {
      // Ensure we stay initialized during chat creation
      setIsInitialized(true);
      // Pass the user message to handleCreateChat for naming
      currentChatId = await handleCreateChat(messageText);
      if (!currentChatId) {
        console.error("Failed to create chat for streaming");
        return;
      }
    }

    handleStreamingMessage(messageText, newBotMessage.id, currentChatId);
  }, [chats, chatId, handleCreateChat, handleStreamingMessage]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleAutoResize = (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLTextAreaElement;

    setTimeout(() => {
      target.style.height = "20px"; // Reset to default height
      if (target.scrollHeight > target.offsetHeight) {
        target.style.height = `${target.scrollHeight}px`; // Adjust height based on content
      }
    }, 0);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    onSubmit: () => Promise<void>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await onSubmit();
    } else {
      handleAutoResize(e);
    }
  };

  // Form submission handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const userMessage: ChatMessage & {
      isLoading?: boolean;
      isStreaming?: boolean;
      isNewMessage?: boolean;
    } = {
      id: `user-${nanoid()}`,
      type: "CANDIDATE",
      role: "USER",
      content: data.message,
      chatSessionId: chatId || "", // Assuming chatId is available
      createdAt: new Date(),
      updatedAt: new Date(),
      isLoading: false,
      isStreaming: false,
      isNewMessage: false,
    };

    const botMessage: ChatMessage & {
      isLoading?: boolean;
      isStreaming?: boolean;
      isNewMessage?: boolean;
    } = {
      id: `bot-${nanoid()}`,
      type: "CANDIDATE",
      role: "ASSISTANT",
      content: "",
      chatSessionId: chatId || "", // Assuming chatId is available
      createdAt: new Date(),
      updatedAt: new Date(),
      isLoading: true,
      isStreaming: true,
      isNewMessage: true,
    };

    setChats([...chats, userMessage, botMessage]);
    form.reset();

    // Reset textarea height after form reset
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  };

  // Effects

  // Initialize widget when it opens or when component mounts
  useEffect(() => {
    if (open) {
      initializeWidget();
      // Refetch chat data when widget is opened to ensure latest data
      refetchChat();
    }
  }, [open, initializeWidget, refetchChat]);

  // Load existing chat data when chatId is set
  useEffect(() => {
    if (chatData?.data && chatId && !isInitialized) {
      // Type assertion to access messages - we know they exist from the action
      const chatWithMessages = chatData.data as any;
      if (chatWithMessages.messages) {
        const previousChats: (ChatMessage & {
          isLoading?: boolean;
          isStreaming?: boolean;
          isNewMessage?: boolean;
        })[] = chatWithMessages.messages.map((message: any) => ({
          id: `msg-${nanoid()}`,
          content: message.content,
          createdAt: message.created_at,
          role: message.role === "USER" ? "USER" : "ASSISTANT",
          chatSessionId: message.chat_session_id, // Assuming chat_session_id is available
          updatedAt: message.updated_at,
          isLoading: false,
          isStreaming: false,
          isNewMessage: false,
        }));

        const finalChats =
          previousChats.length > 0 ? previousChats : [createDefaultGreeting()];
        setChats(finalChats);
        setIsInitialized(true);
      }
    }
  }, [chatData, isInitialized, chatId, createDefaultGreeting]);

  // Check for new messages that need streaming
  useEffect(() => {
    if (isInitialized) {
      checkForNewMessage();
    }
  }, [checkForNewMessage, isInitialized]);

  // Animated placeholder effect
  useEffect(() => {
    const placeholders = [".", "..", "..."];
    let idx = 0;

    const interval = setInterval(() => {
      idx = (idx + 1) % placeholders.length;
      setAnimatedPlaceholder(placeholders[idx]);
    }, 500);

    return () => clearInterval(interval);
  }, [isCreatingChat, isStreaming]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isInitialized && chats.length > 0) {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chats, isInitialized]);

  // Computed values
  const isLoading =
    (chatId && isLoadingChat && !isInitialized) || isDeletingChat;

  return (
    <aside
      className={cn(
        "border-pro-snow-200 fixed right-0 top-0 flex h-dvh flex-col border-x bg-white transition-all duration-500 ease-in-out",
        open ? "w-[24rem]" : "w-0",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-pro-snow-200 flex h-16 items-center justify-between border-b px-4 py-3 transition-all duration-500 ease-in-out",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="bg-pro-gradient-chat relative flex size-8 shrink-0 grow-0 items-center justify-center rounded-full">
            <BotIcon color="#fff" className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-logo text-xs font-semibold">
              AI Assistant
            </span>
            <span className="text-xs text-[#6B7280]">by Hey Amara</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleClearChat} disabled={isLoading}>
            <TrashIcon color="#747474" className="size-5" />
          </button>
          <button onClick={() => setOpen(false)}>
            <XIcon color="#747474" className="size-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-1 items-center justify-center p-6">
          <span className="flex size-20 items-center justify-center">
            <Lottie animationData={blobAnimation} />
          </span>
        </div>
      )}

      {/* Chat Messages using AI Elements */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Conversation className="flex-1">
          <ConversationContent>
            {chats.map((chat) => (
              <Message
                key={chat.id}
                from={chat.role === "USER" ? "user" : "assistant"}
              >
                <MessageContent>
                  {chat.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader size={16} />
                      <span>Thinking{animatedPlaceholder}</span>
                    </div>
                  ) : (
                    <Response>{chat.content}</Response>
                  )}
                </MessageContent>
              </Message>
            ))}
            <div ref={chatEndRef} />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Form using AI Elements */}
        <div className="p-4">
          <PromptInput onSubmit={form.handleSubmit(onSubmit)}>
            <PromptInputTextarea
              ref={textareaRef}
              placeholder="Type your message..."
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, form.handleSubmit(onSubmit))}
              onPaste={handleAutoResize}
              disabled={isStreaming}
              value={form.watch("message")}
              onChange={(e) => form.setValue("message", e.target.value)}
            />
            <PromptInputToolbar>
              <PromptInputSubmit
                disabled={!form.watch("message") || isStreaming}
                status={isStreaming ? "streaming" : undefined}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </aside>
  );
}
