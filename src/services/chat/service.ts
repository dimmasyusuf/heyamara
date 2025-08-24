import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  createChatSession,
  deleteChatSession,
  getChatSession,
  getChatSessions,
} from "@/actions/chat";

import {
  CreateChatSessionRequest,
  GetChatSessionResponse,
  GetChatSessionsParams,
  GetChatSessionsResponse,
} from "@/types/chat";

import { CHAT_KEY } from "./key";

export const useGetChatSessions = (
  params?: GetChatSessionsParams,
  options?: UseQueryOptions<GetChatSessionsResponse>,
) =>
  useQuery({
    queryKey: CHAT_KEY.GET_CHAT_SESSIONS(params),
    queryFn: () => getChatSessions(params),
    ...options,
  });

export const useGetChatSession = (
  chat_id: string,
  options?: UseQueryOptions<GetChatSessionResponse>,
) =>
  useQuery({
    queryKey: CHAT_KEY.GET_CHAT_SESSION(chat_id),
    queryFn: () => getChatSession(chat_id),
    ...options,
  });

export const useCreateChatSession = () =>
  useMutation({
    mutationFn: (request: CreateChatSessionRequest) =>
      createChatSession(request),
  });

export const useDeleteChatSession = () =>
  useMutation({
    mutationFn: (chat_id: string) => deleteChatSession(chat_id),
  });
