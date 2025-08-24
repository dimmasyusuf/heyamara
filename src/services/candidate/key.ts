import { GetCandidatesParams } from "@/types/candidate";

export const CANDIDATE_KEY = {
  GET_CANDIDATES: (params?: GetCandidatesParams) => ["candidates", { params }],
  GET_CANDIDATE: (candidate_id: string) => ["candidate", candidate_id],
  GET_RESUME_ANALYSIS: (candidate_id: string) => [
    "candidates",
    "analysis",
    candidate_id,
  ],
};
