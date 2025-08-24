import { ChatMessage, ChatMessageType, ChatSession } from "@prisma/client";
import { Response } from "./api";

export interface GetChatSessionsParams {
  search?: string;
  offset?: number;
  limit?: number;
}

export interface GetChatSessionsResponse extends Response {
  data: ChatSession[];
}

export interface GetChatSessionResponse extends Response {
  data: ChatSession;
}

export interface CreateChatSessionRequest {
  type?: ChatMessageType;
  message: string;
}

export interface CreateChatSessionResponse extends Response {
  data: ChatSession;
}

export interface StreamChatRequest {
  type?: ChatMessageType;
  chat_id: string;
  message: string;
  candidate_id?: string;
}
