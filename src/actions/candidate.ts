"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import BytePlus from "@/lib/byteplus";
import { DocumentProcessor } from "@/helper/processor";
import { candidatePrompt } from "@/helper/prompt/candidate";
import { Response } from "@/helper/response";
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from "@/types/candidate";

export interface CreateCandidateRequest {
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
}

export interface UpdateCandidateRequest {
  name: string;
  payRate: number;
  payType: string;
  status: string;
  rating: number;
}

export const getCandidates = async () => {
  const candidates = await prisma.candidate.findMany();
  return candidates;
};

export const getCandidate = async (candidate_id: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidate_id },
  });
  return candidate;
};

export const createCandidate = async (request: CreateCandidateRequest) => {
  const { name, email, phone, resumeUrl } = request;

  const candidate = await prisma.candidate.create({
    data: {
      name,
      payRate: 0,
      payType: "HOURLY",
      status: "SUBMITTED",
      rating: 0,
    },
  });

  return candidate;
};

export const updateCandidate = async (
  candidate_id: string,
  request: UpdateCandidateRequest,
) => {
  const { name, payRate, payType, status, rating } = request;

  const candidate = await prisma.candidate.update({
    where: { id: candidate_id },
    data: { name, payRate, payType: "HOURLY", status: "SUBMITTED", rating },
  });

  return candidate;
};

export const deleteCandidate = async (candidate_id: string) => {
  const candidate = await prisma.candidate.delete({
    where: { id: candidate_id },
  });

  return candidate;
};

export async function uploadResume(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(`public/${file.name}`, file);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function analyzeResume(request: AnalyzeResumeRequest) {
  const byteplus = new BytePlus();
  const processor = new DocumentProcessor();

  const file = request.get("file") as File;
  const candidate_id = request.get("candidate_id") as string;

  const processedDocument = await processor.processDocument(file);

  const { text } = processedDocument;

  const prompt = candidatePrompt(text);

  const response = await byteplus.chat({
    model: "seed-1-6-250615",
    messages: [{ role: "user", content: prompt }],
  });

  const message = response.choices[0].message;

  const uploadResponse = await uploadResume(request);

  if (!uploadResponse) {
    return Response({
      status: 400,
      message: "Failed to upload resume",
    });
  }

  return Response<AnalyzeResumeResponse>({
    status: 200,
    message: "Resume analyzed successfully",
    data: message,
  });
}
