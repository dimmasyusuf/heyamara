/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BotIcon, GlobeIcon } from "lucide-react";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useParams, usePathname } from "next/navigation";
import Lottie from "lottie-react";

import { cn } from "@/lib/utils";
import {
  CHAT_KEY,
  useCreateChatSession,
  useDeleteChatSession,
  useGetChatSession,
} from "@/services/chat";
import blobAnimation from "@/assets/lottie/blob.json";
import { useWidgetStore } from "@/stores/widget";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { ChatMessage } from "@prisma/client";
import { streamChat } from "@/actions/chat";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { IconTrash, IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";

// ===== CONSTANTS =====
const WIDGET_TYPES = {
  RESUME: "AMARA_WIDGET_RESUME",
} as const;

const SUGGESTIONS = [
  "Optimize this resume",
  "Add skills to make resume stand out",
  "Improve formatting and layout",
  "Suggest better action verbs",
  "What sections to add/remove?",
];

const MODELS = [
  { id: "seed-1-6-250615", name: "Seed 1.6" },
  { id: "seed-1-6-flash-250715", name: "Seed 1.6 Flash" },
  { id: "deepseek-v3-1-250821", name: "DeepSeek V3.1" },
];

const ANIMATED_DOTS = [".", "..", "..."];
const DOT_ANIMATION_INTERVAL = 500;

// ===== TYPES =====
const FormSchema = z.object({
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

type ExtendedChatMessage = ChatMessage & {
  isLoading?: boolean;
  isStreaming?: boolean;
  isNewMessage?: boolean;
};

// ===== CUSTOM HOOKS =====

/**
 * Hook to manage animated placeholder dots
 */
function useAnimatedDots(isActive: boolean) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!isActive) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % ANIMATED_DOTS.length;
      setDots(ANIMATED_DOTS[index]);
    }, DOT_ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive]);

  return dots;
}

/**
 * Hook to manage cookie-based chat persistence
 */
function useChatPersistence() {
  const getCookieKey = useCallback(() => WIDGET_TYPES.RESUME, []);

  const getStoredChatId = useCallback(
    () => Cookies.get(getCookieKey()),
    [getCookieKey],
  );

  const storeChatId = useCallback(
    (chatId: string) => {
      const cookieKey = getCookieKey();
      Cookies.set(cookieKey, chatId);
    },
    [getCookieKey],
  );

  const clearStoredChatId = useCallback(() => {
    Cookies.remove(getCookieKey());
  }, [getCookieKey]);

  return {
    getStoredChatId,
    storeChatId,
    clearStoredChatId,
  };
}

/**
 * Hook to manage auto-scroll behavior
 */
function useAutoScroll(shouldScroll: boolean, dependency: any[]) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScroll) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [shouldScroll, dependency]);

  return scrollRef;
}

// ===== MESSAGE UTILITIES =====

/**
 * Creates the default greeting message shown when widget opens
 */
function createDefaultGreeting(): ExtendedChatMessage {
  return {
    id: `bot-${nanoid()}`,
    type: "RESUME",
    role: "ASSISTANT",
    content: `Hi! 👋🏻\nHow can I help you today?`,
    chatSessionId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isLoading: false,
    isStreaming: false,
    isNewMessage: false,
  };
}

/**
 * Creates a user message from form input
 */
function createUserMessage(
  content: string,
  chatId: string,
): ExtendedChatMessage {
  return {
    id: `user-${nanoid()}`,
    type: "RESUME",
    role: "USER",
    content,
    chatSessionId: chatId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isLoading: false,
    isStreaming: false,
    isNewMessage: false,
  };
}

/**
 * Creates a bot message that will be populated via streaming
 */
function createBotMessage(chatId: string): ExtendedChatMessage {
  return {
    id: `bot-${nanoid()}`,
    type: "RESUME",
    role: "ASSISTANT",
    content: "",
    chatSessionId: chatId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isLoading: true,
    isStreaming: true,
    isNewMessage: true,
  };
}

/**
 * Transforms API messages to UI format
 */
function transformApiMessagesToUI(apiMessages: any[]): ExtendedChatMessage[] {
  return apiMessages.map((message) => ({
    id: `msg-${nanoid()}`,
    content: message.content,
    createdAt: message.created_at,
    role: message.role === "USER" ? "USER" : "ASSISTANT",
    chatSessionId: message.chat_session_id,
    updatedAt: message.updated_at,
    type: "RESUME" as any,
    isLoading: false,
    isStreaming: false,
    isNewMessage: false,
  }));
}

// ===== MAIN COMPONENT =====
export default function AmaraWidget() {
  const { candidate_id } = useParams<{ candidate_id: string }>();
  const { open, setOpen } = useWidgetStore();
  const pathname = usePathname();

  // ===== STATE MANAGEMENT =====
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // ===== REFS FOR STREAMING CONTROL =====
  const isStreamingRef = useRef(false);
  const currentStreamingMessageRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ===== CUSTOM HOOKS =====
  const { getStoredChatId, storeChatId, clearStoredChatId } =
    useChatPersistence();
  const animatedDots = useAnimatedDots(isStreaming);
  const scrollRef = useAutoScroll(isInitialized && messages.length > 0, [
    messages,
    isInitialized,
  ]);

  // ===== API HOOKS =====
  const {
    data: chatData,
    isLoading: isLoadingChat,
    refetch: refetchChat,
  } = useGetChatSession(chatId as string, {
    queryKey: CHAT_KEY.GET_CHAT_SESSION(chatId as string),
    enabled: !!chatId,
  });

  const { mutateAsync: createChat } = useCreateChatSession();
  const { mutateAsync: deleteChat, isPending: isDeletingChat } =
    useDeleteChatSession();

  // ===== FORM SETUP =====
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { message: "" },
  });

  // ===== CHAT SESSION MANAGEMENT =====

  /**
   * Creates a new chat session
   */
  const handleCreateChatSession = useCallback(
    async (firstMessage?: string): Promise<string | null> => {
      try {
        const response = await createChat({
          type: "RESUME",
          message: firstMessage || "New chat",
        });

        if (response?.data?.id) {
          const newChatId = response.data.id;
          storeChatId(newChatId);
          setChatId(newChatId);
          return newChatId;
        }
      } catch (error) {
        console.error("Failed to create chat session:", error);
      }
      return null;
    },
    [createChat, storeChatId],
  );

  /**
   * Clears the current chat session
   */
  const handleClearChat = useCallback(async () => {
    try {
      // Delete existing chat from database
      if (chatId) {
        await deleteChat(chatId);
      }

      // Reset all state
      clearStoredChatId();
      setChatId(null);
      setMessages([createDefaultGreeting()]);
      setIsInitialized(true);

      // Refresh data
      refetchChat();
    } catch (error) {
      console.error("Failed to clear chat:", error);

      // Reset UI even if API call fails
      clearStoredChatId();
      setChatId(null);
      setMessages([createDefaultGreeting()]);
      setIsInitialized(true);
      refetchChat();
    }
  }, [chatId, deleteChat, clearStoredChatId, refetchChat]);

  // ===== MESSAGE STREAMING =====

  /**
   * Handles streaming response from the AI
   */
  const handleMessageStreaming = useCallback(
    async (
      userMessage: string,
      botMessageId: string,
      currentChatId: string,
    ) => {
      setIsStreaming(true);
      isStreamingRef.current = true;
      currentStreamingMessageRef.current = userMessage;

      try {
        const streamedContent = await streamChat({
          message: userMessage,
          chat_id: currentChatId,
          type: "RESUME",
          candidate_id,
        });

        // Update the bot message with streamed content
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === botMessageId
              ? {
                  ...message,
                  content:
                    (typeof streamedContent === "string" && streamedContent) ||
                    "Sorry, I couldn't process your request.",
                  isLoading: false,
                  isStreaming: false,
                  isNewMessage: false,
                }
              : message,
          ),
        );
      } catch (error) {
        console.error("Message streaming failed:", error);

        // Handle streaming error
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === botMessageId
              ? {
                  ...message,
                  content:
                    "Sorry, I encountered an error while processing your request.",
                  isLoading: false,
                  isStreaming: false,
                  isNewMessage: false,
                }
              : message,
          ),
        );
      } finally {
        // Clean up streaming state
        isStreamingRef.current = false;
        currentStreamingMessageRef.current = null;
        setIsStreaming(false);
        refetchChat();
      }
    },
    [candidate_id, refetchChat],
  );

  /**
   * Processes new messages that need streaming
   */
  const processNewMessages = useCallback(async () => {
    // Find a new bot message that needs streaming
    const newBotMessage = messages.find(
      (message) =>
        message.isNewMessage &&
        message.role === "ASSISTANT" &&
        message.isLoading,
    );

    if (!newBotMessage || isStreamingRef.current) {
      return;
    }

    // Find the corresponding user message
    const botMessageIndex = messages.findIndex(
      (msg) => msg.id === newBotMessage.id,
    );
    if (botMessageIndex <= 0) return;

    const userMessage = messages[botMessageIndex - 1];
    if (!userMessage || userMessage.role !== "USER") return;

    const messageContent = userMessage.content.trim();
    if (
      !messageContent ||
      currentStreamingMessageRef.current === messageContent
    ) {
      return;
    }

    // Ensure we have a chat session
    let activeChatId = chatId;
    if (!activeChatId) {
      setIsInitialized(true);
      activeChatId = await handleCreateChatSession(messageContent);
      if (!activeChatId) {
        console.error("Failed to create chat session for streaming");
        return;
      }
    }

    handleMessageStreaming(messageContent, newBotMessage.id, activeChatId);
  }, [messages, chatId, handleCreateChatSession, handleMessageStreaming]);

  // ===== WIDGET INITIALIZATION =====

  /**
   * Initializes the widget when opened
   */
  const initializeWidget = useCallback(() => {
    const existingChatId = getStoredChatId();

    if (existingChatId) {
      // Load existing chat session
      setChatId(existingChatId);
      setIsInitialized(false); // Will be set to true when data loads
    } else {
      // Show default greeting without creating a chat session
      setMessages([createDefaultGreeting()]);
      setIsInitialized(true);
    }
  }, [getStoredChatId]);

  // ===== FORM HANDLING =====

  /**
   * Handles form submission and message sending
   */
  const handleFormSubmit = useCallback(
    (data: FormData) => {
      const userMessage = createUserMessage(data.message, chatId || "");
      const botMessage = createBotMessage(chatId || "");

      // Add both messages to the conversation
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);

      // Reset form and textarea
      form.reset();
      if (textareaRef.current) {
        textareaRef.current.style.height = "20px";
      }
    },
    [chatId, form],
  );

  /**
   * Handles suggestion clicks
   */
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      form.setValue("message", suggestion);
      form.handleSubmit(handleFormSubmit)();
    },
    [form, handleFormSubmit],
  );

  // ===== TEXTAREA UTILITIES =====

  const handleTextareaAutoResize = (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLTextAreaElement;

    setTimeout(() => {
      target.style.height = "20px";
      if (target.scrollHeight > target.offsetHeight) {
        target.style.height = `${target.scrollHeight}px`;
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
      handleTextareaAutoResize(e);
    }
  };

  // ===== EFFECTS =====

  // Close widget on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Initialize widget when opened
  useEffect(() => {
    if (open) {
      initializeWidget();
      refetchChat();
    }
  }, [open, initializeWidget, refetchChat]);

  // Load existing chat data
  useEffect(() => {
    if (chatData?.data && chatId && !isInitialized) {
      const chatWithMessages = chatData.data as any;
      if (chatWithMessages.messages) {
        const transformedMessages = transformApiMessagesToUI(
          chatWithMessages.messages,
        );
        const finalMessages =
          transformedMessages.length > 0
            ? transformedMessages
            : [createDefaultGreeting()];

        setMessages(finalMessages);
        setIsInitialized(true);
      }
    }
  }, [chatData, isInitialized, chatId]);

  // Process new messages for streaming
  useEffect(() => {
    if (isInitialized) {
      processNewMessages();
    }
  }, [processNewMessages, isInitialized]);

  // ===== COMPUTED VALUES =====
  const isLoading =
    (chatId && isLoadingChat && !isInitialized) || isDeletingChat;

  // ===== RENDER =====
  return (
    <aside
      className={cn(
        "fixed right-0 top-0 flex h-dvh flex-col border-x bg-background transition-all duration-200 ease-linear",
        open ? "w-[24rem]" : "w-0",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center justify-between border-b px-4 py-3 transition-all duration-500 ease-in-out",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex size-8 shrink-0 grow-0 items-center justify-center rounded-full bg-foreground">
            <BotIcon className="size-5 text-background" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">AI Assistant</span>
            <span className="text-xs text-muted-foreground">by Hey Amara</span>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 [&_svg]:size-5"
            onClick={handleClearChat}
            disabled={isLoading}
          >
            <IconTrash />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 [&_svg]:size-5"
            onClick={() => setOpen(false)}
          >
            <IconX />
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.map((message) => (
              <Message
                key={message.id}
                from={message.role === "USER" ? "user" : "assistant"}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={16} />
                    <span className="text-sm">Thinking{animatedDots}</span>
                  </div>
                ) : (
                  <MessageContent>
                    <Response>{message.content}</Response>
                  </MessageContent>
                )}
              </Message>
            ))}

            <div ref={scrollRef} />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center p-6">
            <span className="flex size-16 items-center justify-center">
              <Lottie animationData={blobAnimation} />
            </span>
          </div>
        )}

        {/* Input Section */}
        <div className="p-4">
          {/* Suggestions */}
          <Suggestions>
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>

          {/* Input Form */}
          <PromptInput
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="mt-4"
          >
            <PromptInputTextarea
              ref={textareaRef}
              onChange={(e) => form.setValue("message", e.target.value)}
              value={form.watch("message")}
              onKeyDown={(e) =>
                handleKeyDown(e, form.handleSubmit(handleFormSubmit))
              }
              onPaste={handleTextareaAutoResize}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton
                  variant={webSearchEnabled ? "default" : "ghost"}
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputModelSelect
                  onValueChange={setSelectedModel}
                  value={selectedModel}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {MODELS.map((model) => (
                      <PromptInputModelSelectItem
                        key={model.id}
                        value={model.id}
                      >
                        {model.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!form.watch("message")}
                status={isStreaming ? "streaming" : undefined}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </aside>
  );
}
