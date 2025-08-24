"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import BytePlus from "@/lib/byteplus";
import { DocumentProcessor } from "@/helper/processor";
import { Response } from "@/helper/response";
import {
  AnalyzeResumeRequest,
  AnalyzeResumeResponse,
  CreateCandidateResponse,
  GetCandidateResponse,
  GetCandidatesResponse,
  UpdateCandidateResponse,
  DeleteCandidateResponse,
  CreateCandidateRequest,
  UpdateCandidateRequest,
  GetCandidatesParams,
} from "@/types/candidate";
import ResumePrompt from "@/helper/prompt/resume";

export const getCandidates = async (params?: GetCandidatesParams) => {
  const { search, offset, limit } = params || {};

  const page = offset || 1;
  const per_page = limit || 10;

  const whereClause =
    search && search.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" as const } },
            { role: { contains: search.trim(), mode: "insensitive" as const } },
            {
              location: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

  const total = await prisma.candidate.count({
    where: whereClause,
  });

  const candidates = await prisma.candidate.findMany({
    where: whereClause,
    skip: (page - 1) * per_page,
    take: per_page,
  });

  return Response<GetCandidatesResponse>({
    status: 200,
    message: "Candidates fetched successfully",
    data: candidates,
    pagination: {
      page: page,
      per_page: per_page,
      total: total,
      total_pages: Math.ceil(total / per_page),
    },
  });
};

export const getCandidate = async (candidate_id: string) => {
  if (!candidate_id) {
    return Response({
      status: 400,
      message: "Candidate ID is required",
    });
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidate_id },
    include: {
      resume: {
        include: {
          analysis: true,
        },
      },
    },
  });

  if (!candidate) {
    return Response({
      status: 404,
      message: "Candidate not found",
    });
  }

  return Response<GetCandidateResponse>({
    status: 200,
    message: "Candidate fetched successfully",
    data: candidate,
  });
};

export const createCandidate = async (request: CreateCandidateRequest) => {
  const { name, role, location, date } = request;

  const candidate = await prisma.candidate.create({
    data: {
      name,
      role,
      location,
      date,
    },
  });

  return Response<CreateCandidateResponse>({
    status: 200,
    message: "Candidate created successfully",
    data: candidate,
  });
};

export const updateCandidate = async (
  candidate_id: string,
  request: UpdateCandidateRequest,
) => {
  if (!candidate_id) {
    return Response({
      status: 400,
      message: "Candidate ID is required",
    });
  }

  const { name, role, date, location, payRate, payType, status, rating } =
    request;

  const candidate = await prisma.candidate.update({
    where: { id: candidate_id },
    data: { name, role, date, location, payRate, payType, status, rating },
  });

  return Response<UpdateCandidateResponse>({
    status: 200,
    message: "Candidate updated successfully",
    data: candidate,
  });
};

export const deleteCandidate = async (candidate_id: string) => {
  if (!candidate_id) {
    return Response({
      status: 400,
      message: "Candidate ID is required",
    });
  }

  const candidate = await prisma.candidate.delete({
    where: { id: candidate_id },
  });

  return Response<DeleteCandidateResponse>({
    status: 200,
    message: "Candidate deleted successfully",
    data: candidate,
  });
};

export async function uploadResume(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(file.name, file, {
      upsert: true,
    });

  if (error) {
    return Response({
      status: 400,
      message: error.message,
    });
  }

  return Response({
    status: 200,
    message: "Resume uploaded successfully",
    data: data,
  });
}

export async function analyzeResume(request: AnalyzeResumeRequest) {
  const byteplus = new BytePlus();
  const processor = new DocumentProcessor();
  const resumePrompt = new ResumePrompt();

  const file = request.get("file") as File;
  const candidate_id = request.get("candidate_id") as string;

  // Stage 1: Document Processing (10%)
  const processedDocument = await processor.processDocument(file);
  const { text } = processedDocument;

  // Stage 2: Prompt Generation (20%)
  const prompt = resumePrompt.analyze(text);

  // Stage 3: File Upload (30%)
  const uploadResponse = await uploadResume(request);

  if (uploadResponse.status !== 200) {
    return Response({
      status: 400,
      message: uploadResponse.message,
    });
  }

  // Stage 4: Resume Creation (40%)
  const resume = await prisma.resume.create({
    data: {
      candidateId: candidate_id,
      bucketName: "resumes",
      fileId: uploadResponse.data.id,
      path: uploadResponse.data.path,
      fullPath: uploadResponse.data.fullPath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    },
  });

  // Create ResumeAnalysis record with initial progress
  await prisma.resumeAnalysis.create({
    data: {
      resumeId: resume.id,
      status: "IN_PROGRESS",
      progress: 40,
      analysis: "",
    },
  });

  // Update progress to 50%
  await prisma.resumeAnalysis.update({
    where: { resumeId: resume.id },
    data: { progress: 50 },
  });

  // Stage 5: AI Analysis (60-90%)
  const response = await byteplus.chat({
    model: "seed-1-6-250615",
    messages: [{ role: "user", content: prompt }],
  });

  // Update progress to 90% during AI processing
  await prisma.resumeAnalysis.update({
    where: { resumeId: resume.id },
    data: {
      status: "IN_PROGRESS",
      progress: 90,
    },
  });

  if (response.choices.length === 0) {
    // Update status to failed
    await prisma.resumeAnalysis.update({
      where: { resumeId: resume.id },
      data: {
        status: "FAILED",
        progress: 0,
        analysis: "AI analysis failed - no response received",
      },
    });

    return Response({
      status: 400,
      message: "Failed to analyze resume",
    });
  }

  const message = response.choices[0].message;

  // Stage 6: Final Processing (100%)
  await prisma.resumeAnalysis.update({
    where: { resumeId: resume.id },
    data: {
      status: "SUCCEEDED",
      analysis: message.content,
      progress: 100,
      summary: message.content,
      keywords: message.content,
      score: 100,
    },
  });

  return Response<AnalyzeResumeResponse>({
    status: 200,
    message: "Resume analyzed successfully",
    data: message,
  });
}
