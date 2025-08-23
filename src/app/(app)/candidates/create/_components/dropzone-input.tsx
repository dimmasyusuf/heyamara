import { useDropzone } from "react-dropzone";
import type {
  Accept,
  DropEvent,
  DropzoneOptions,
  FileRejection,
  FileWithPath,
} from "react-dropzone";

import { FileTextIcon, PlusIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DropzoneInputProps extends DropzoneOptions {
  accept?: Accept;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  onChange?: (files: FileWithPath[]) => void;
}

export default function DropzoneInput({
  accept = {
    "application/pdf": [".pdf"],
  },
  className,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 100, // 100MB
  minSize = 0,
  onChange,
  ...props
}: DropzoneInputProps) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize, // 100MB
    minSize,
    onDrop: (acceptedFiles, fileRejections, event) =>
      handleFileDrop({
        acceptedFiles,
        fileRejections,
        event,
        onChange,
        maxFiles,
        maxSize,
        minSize,
        accept,
      }),
    ...props,
  });

  const isDisabled = props.disabled;

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group flex h-full w-full flex-col items-center justify-center gap-4 p-10 focus-visible:outline-none",
        isDisabled
          ? "border-pro-snow-300 cursor-not-allowed bg-white"
          : [
              "cursor-pointer",
              (isDragActive || false) && "bg-neutral-100",
              "hover:bg-neutral-50",
            ],
        className,
      )}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      <input {...getInputProps()} disabled={isDisabled} />

      <div className="flex size-12 shrink-0 grow-0 items-center justify-center rounded-full border">
        <FileTextIcon size={24} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h6 className="text-base font-semibold">Upload Original CV</h6>
        <p className="text-sm">Upload the candidate's original CV document</p>
        <Button size="sm" className="w-fit">
          <PlusIcon />
          Choose File
        </Button>
        <p className="text-sm">or drag and drop here</p>
        <p className="text-sm">
          {`Supported Format: .pdf, .doc, .docx • Max size: ${formatBytes(maxSize)}`}
        </p>
      </div>
    </div>
  );
}

function handleFileDrop({
  acceptedFiles,
  fileRejections,
  event,
  onChange,
  onDrop,
  maxFiles = 1,
  maxSize = Infinity,
  minSize = 0,
}: {
  acceptedFiles: FileWithPath[];
  fileRejections: FileRejection[];
  event: DropEvent;
  onChange?: (files: FileWithPath[]) => void;
  onDrop?: DropzoneOptions["onDrop"];
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  accept?: Accept;
}) {
  if (acceptedFiles.length > maxFiles) {
    toast.error(`Too many files (max. ${maxFiles})`);
    return;
  }

  if (onChange) onChange(acceptedFiles);

  if (fileRejections.length > 0) {
    const groupedMessages = fileRejections.reduce(
      (acc, { file, errors }) => {
        acc[file.name] = acc[file.name] || [];
        errors.forEach((err) => {
          switch (err.code) {
            case "file-too-large":
              acc[file.name].push(
                `is too large (max. ${formatBytes(maxSize)})`,
              );
              break;
            case "file-too-small":
              acc[file.name].push(
                `is too small (min. ${formatBytes(minSize)})`,
              );
              break;
            case "too-many-files":
              acc[file.name].push(`Too many files (max. ${maxFiles})`);
              break;
            case "file-invalid-type":
              acc[file.name].push(`has an unsupported file type`);
              break;
            default:
              acc[file.name].push(err.message);
          }
        });
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const messages = Object.entries(groupedMessages).map(
      ([fileName, messages]) => `${fileName}: ${messages.join(", ")}`,
    );

    toast.error("File Rejected", {
      description: (
        <span dangerouslySetInnerHTML={{ __html: messages.join("<br />") }} />
      ),
      duration: 5000,
    });
  }

  if (onDrop) {
    onDrop(acceptedFiles, fileRejections, event);
  }
}
