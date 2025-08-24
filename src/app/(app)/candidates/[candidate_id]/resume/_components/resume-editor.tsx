import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/state";
import { useAnalyzeResume } from "@/services/candidate";
import { useCandidateStore } from "@/stores/candidate";
import { AmaraSpinner } from "@/components/spinner";
import { Response } from "@/components/ai-elements/response";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { GetCandidateResponse } from "@/types/candidate";

interface ResumeEditorProps {
  candidate?: GetCandidateResponse["data"];
  isLoading?: boolean;
}

export default function ResumeEditor({
  candidate,
  isLoading,
}: ResumeEditorProps) {
  const { candidate_id } = useParams<{ candidate_id: string }>();
  const { files } = useCandidateStore();
  const { mutateAsync, isPending } = useAnalyzeResume();

  const handleAnalyzeResume = async () => {
    console.log("files", files);
    if (files.length === 0) return;
    const file = files[0];
    console.log("file", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidate_id", candidate_id);

    const response = await mutateAsync(formData);

    if (response.status !== 200) {
      toast.error(response.message);
      return;
    }

    toast.success("Resume analyzed successfully");
  };

  if (candidate?.resume?.analysis) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Analysis</h2>
        <Response>{candidate.resume.analysis.analysis}</Response>
      </div>
    );
  }

  if (isLoading || isPending) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <AmaraSpinner />
      </div>
    );
  }

  return (
    <EmptyState
      title={candidate?.resume ? "Ready to Analyze" : "Upload a Resume"}
      description={
        candidate?.resume
          ? "Resume uploaded! Click below to analyze and uncover valuable candidate insights in seconds."
          : "Upload a candidate's resume to get started. We accept PDF, DOC, or DOCX files—making it easy to kick off your hiring process."
      }
    >
      {(candidate?.resume || files.length > 0) && (
        <Button size="lg" className="w-full" onClick={handleAnalyzeResume}>
          Analyze Resume
        </Button>
      )}
    </EmptyState>
  );
}
