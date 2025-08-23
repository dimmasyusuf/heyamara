import { useMutation, useQuery } from "@tanstack/react-query";

import {
  analyzeResume,
  CreateCandidateRequest,
  createCandidate,
  deleteCandidate,
  getCandidate,
  getCandidates,
  updateCandidate,
  UpdateCandidateRequest,
  uploadResume,
} from "@/actions/candidate";
import { CANDIDATE_KEY } from "./key";
import { AnalyzeResumeRequest } from "@/types/candidate";

export const useGetCandidates = () =>
  useQuery({
    queryKey: CANDIDATE_KEY.GET_CANDIDATES,
    queryFn: getCandidates,
  });

export const useGetCandidate = (candidate_id: string) =>
  useQuery({
    queryKey: CANDIDATE_KEY.GET_CANDIDATE(candidate_id),
    queryFn: () => getCandidate(candidate_id),
  });

export const useCreateCandidate = () =>
  useMutation({
    mutationFn: (request: CreateCandidateRequest) => createCandidate(request),
  });

export const useUpdateCandidate = () =>
  useMutation({
    mutationFn: ({
      candidate_id,
      request,
    }: {
      candidate_id: string;
      request: UpdateCandidateRequest;
    }) => updateCandidate(candidate_id, request),
  });

export const useDeleteCandidate = () =>
  useMutation({
    mutationFn: (candidate_id: string) => deleteCandidate(candidate_id),
  });

export const useUploadResume = () =>
  useMutation({
    mutationFn: (formData: FormData) => uploadResume(formData),
  });

export const useAnalyzeResume = () =>
  useMutation({
    mutationFn: (request: AnalyzeResumeRequest) => analyzeResume(request),
  });
