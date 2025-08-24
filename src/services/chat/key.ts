import { GetChatSessionsParams } from "@/types/chat";

export const CHAT_KEY = {
  GET_CHAT_SESSIONS: (params?: GetChatSessionsParams) => ["chats", { params }],
  GET_CHAT_SESSION: (chat_id: string) => ["chat", chat_id],
};
