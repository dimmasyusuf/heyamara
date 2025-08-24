import DropzoneInput from "./dropzone-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { useCandidateStore } from "@/stores/candidate";
import { createClient } from "@/lib/supabase/client";
import { AmaraIframe } from "@/components/preview";
import { formatBytes } from "@/lib/utils";
import { GetCandidateResponse } from "@/types/candidate";

interface ResumePreviewProps {
  candidate?: GetCandidateResponse["data"];
}

export default function ResumePreview({ candidate }: ResumePreviewProps) {
  const supabase = createClient();

  const { files, setFiles } = useCandidateStore();

  if (candidate?.resume) {
    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(candidate.resume.path);

    return (
      <div className="flex h-full w-full">
        <AmaraIframe src={data.publicUrl} title={candidate.resume.fileName} />
      </div>
    );
  }

  if (files.length > 0) {
    const fileUrl = URL.createObjectURL(files[0]);

    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <Upload size={16} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-medium text-muted-foreground">
                {files[0].name}
              </span>
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {formatBytes(files[0].size)}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([]);
              URL.revokeObjectURL(fileUrl);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Upload Another
          </Button>
        </div>

        <AmaraIframe src={fileUrl} title={files[0].name} />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <DropzoneInput
        accept={{
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
        }}
        maxSize={1024 * 1024 * 50} // 50MB
        onChange={(files) => setFiles(files)}
      />
    </div>
  );
}
