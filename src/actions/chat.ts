"use server";

import { auth } from "@/auth";
import ChatPrompt from "@/helper/prompt/chat";
import WidgetPrompt from "@/helper/prompt/widget";
import { Response } from "@/helper/response";
import BytePlus from "@/lib/byteplus";
import { prisma } from "@/lib/prisma";
import { ChatMessageType, ChatMessageRole } from "@prisma/client";
import { BytePlusMessage } from "@/types/byteplus";
import {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  GetChatSessionResponse,
  GetChatSessionsParams,
  GetChatSessionsResponse,
  StreamChatRequest,
} from "@/types/chat";
import { jsonrepair } from "jsonrepair";
import { revalidatePath } from "next/cache";

export const getChatSessions = async (params?: GetChatSessionsParams) => {
  const { search, offset, limit } = params || {};

  const chats = await prisma.chatSession.findMany({
    skip: offset,
    take: limit,
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  return Response<GetChatSessionsResponse>({
    status: 200,
    message: "Chat sessions fetched successfully",
    data: chats,
  });
};

export const getChatSession = async (chat_id: string) => {
  if (!chat_id) {
    return Response({
      status: 400,
      message: "Chat ID is required",
    });
  }

  const chat = await prisma.chatSession.findUnique({
    where: {
      id: chat_id,
    },
    include: {
      messages: true,
    },
  });

  if (!chat) {
    return Response({
      status: 404,
      message: "Chat session not found",
    });
  }

  return Response<GetChatSessionResponse>({
    status: 200,
    message: "Chat session fetched successfully",
    data: chat,
  });
};

export const createChatSession = async (request: CreateChatSessionRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    return Response({
      status: 401,
      message: "Unauthorized",
    });
  }

  const byteplus = new BytePlus();
  const chatPrompt = new ChatPrompt();

  if (!request.message) {
    return Response({
      status: 400,
      message: "Message is required",
    });
  }

  const messages = [
    {
      role: "system",
      content: chatPrompt.create(request.message),
    },
    {
      role: "user",
      content: request.message,
    },
  ] as BytePlusMessage[];

  const response = await byteplus.chat({
    model: "seed-1-6-250615",
    messages: messages,
  });

  const content = response.choices[0].message.content;

  console.log(content);

  const json = JSON.parse(jsonrepair(content)) || {};

  const title = json.title as string;
  const description = json.description as string;

  console.log(json);

  const chat = await prisma.chatSession.create({
    data: {
      title: title,
      description: description,
      userId: session.user.id,
    },
  });

  return Response<CreateChatSessionResponse>({
    status: 200,
    message: "Chat session created successfully",
    data: chat,
  });
};

export const deleteChatSession = async (chat_id: string) => {
  if (!chat_id) {
    return Response({
      status: 400,
      message: "Chat ID is required",
    });
  }

  await prisma.chatSession.delete({
    where: { id: chat_id },
  });

  return Response({
    status: 200,
    message: "Chat session deleted successfully",
  });
};

export const streamChat = async (request: StreamChatRequest) => {
  const byteplus = new BytePlus();
  const widget = new WidgetPrompt();

  const session = await auth();

  if (!session) {
    return Response({
      status: 401,
      message: "Unauthorized",
    });
  }

  const { message, chat_id, type, candidate_id } = request;

  if (!chat_id) {
    return Response({
      status: 400,
      message: "Chat ID is required",
    });
  }

  if (type === ChatMessageType.RESUME) {
    const resume = await prisma.resume.findUnique({
      where: { candidateId: candidate_id },
      include: {
        analysis: true,
      },
    });

    await prisma.chatMessage.create({
      data: {
        type: ChatMessageType.RESUME,
        role: ChatMessageRole.USER,
        content: message,
        chatSessionId: chat_id,
      },
    });

    if (!resume) {
      return Response({
        status: 404,
        message: "Resume not found",
      });
    }

    const prompt = widget.resume(message, resume.analysis?.analysis || "");

    const messages = [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: message,
      },
    ] as BytePlusMessage[];

    const findCommand = await byteplus.chat({
      model: "seed-1-6-250615",
      messages: messages,
    });

    const content = findCommand.choices[0].message.content;

    const json = JSON.parse(jsonrepair(content)) || {};

    const jsonCommand = json.command as string;
    const jsonMessage = json.message as string;
    const jsonResponse = json.response as string;

    await prisma.chatMessage.create({
      data: {
        type: ChatMessageType.RESUME,
        role: ChatMessageRole.ASSISTANT,
        content: jsonMessage,
        chatSessionId: chat_id,
      },
    });

    if (jsonCommand === "action") {
      await prisma.resumeAnalysis.update({
        where: { resumeId: resume.id },
        data: {
          analysis: jsonResponse,
        },
      });

      revalidatePath(`/candidates/${candidate_id}/resume`);

      return jsonMessage;
    }

    return jsonMessage;
  }
};
