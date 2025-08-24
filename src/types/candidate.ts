import {
  Candidate,
  CandidateStatus,
  PayType,
  Resume,
  ResumeAnalysis,
} from "@prisma/client";

import { Response } from "./api";

export interface GetCandidatesParams {
  search?: string;
  offset?: number;
  limit?: number;
}

export interface GetCandidatesResponse extends Response {
  data: Candidate[];
}

export interface GetCandidateResponse extends Response {
  data: Candidate & {
    resume:
      | (Resume & {
          analysis: ResumeAnalysis | null;
        })
      | null;
  };
}

export interface CreateCandidateRequest {
  name: string;
  role: string;
  location: string;
  date: Date;
}

export interface CreateCandidateResponse extends Response {
  data: Candidate;
}

export interface UpdateCandidateRequest {
  name?: string;
  role?: string;
  location?: string;
  date?: Date;
  payRate?: number;
  payType?: PayType;
  status?: CandidateStatus;
  rating?: number;
}

export interface UpdateCandidateResponse extends Response {
  data: Candidate;
}

export interface DeleteCandidateResponse extends Response {
  data: Candidate;
}

export type AnalyzeResumeRequest = FormData;

export interface AnalyzeResumeResponse extends Response {
  data: {
    finish_reason: string;
    index: number;
    logprobs: string | null;
    content: string;
    reasoning_content: string;
    role: string;
  };
}
