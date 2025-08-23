import DropzoneInput from "./dropzone-input";
import { PDFViewer } from "@/components/amara/PDFViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { useCandidateStore } from "@/stores/candidate";

export default function ResumePreview() {
  const { files, setFiles } = useCandidateStore();

  if (files.length > 0) {
    const fileUrl = URL.createObjectURL(files[0]);

    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {files[0].name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([]);
              // Clean up the created URL to prevent memory leaks
              URL.revokeObjectURL(fileUrl);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Upload Another
          </Button>
        </div>

        <div className="flex-1">
          <PDFViewer src={fileUrl} title={files[0].name} />
        </div>
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
