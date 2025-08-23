export type AnalyzeResumeRequest = FormData;

export interface AnalyzeResumeResponse {
  finish_reason: string;
  index: number;
  logprobs: string | null;
  content: string;
  reasoning_content: string;
  role: string;
}
