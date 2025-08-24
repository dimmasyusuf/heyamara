import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  analyzeResume,
  createCandidate,
  deleteCandidate,
  getCandidate,
  getCandidates,
  updateCandidate,
  uploadResume,
} from "@/actions/candidate";

import {
  AnalyzeResumeRequest,
  CreateCandidateRequest,
  GetCandidateResponse,
  GetCandidatesParams,
  GetCandidatesResponse,
  UpdateCandidateRequest,
} from "@/types/candidate";

import { CANDIDATE_KEY } from "./key";

export const useGetCandidates = (
  params?: GetCandidatesParams,
  options?: UseQueryOptions<GetCandidatesResponse>,
) =>
  useQuery({
    queryKey: CANDIDATE_KEY.GET_CANDIDATES(params),
    queryFn: () => getCandidates(params),
    ...options,
  });

export const useGetCandidate = (
  candidate_id: string,
  options?: UseQueryOptions<GetCandidateResponse>,
) =>
  useQuery({
    queryKey: CANDIDATE_KEY.GET_CANDIDATE(candidate_id),
    queryFn: () => getCandidate(candidate_id),
    ...options,
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
