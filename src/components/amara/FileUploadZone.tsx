"use client";

import React, { useCallback, useState } from "react";
import { Upload, FileText, Video, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  title: string;
  description: string;
  acceptedTypes: string;
  onUpload: (file: File) => void;
  className?: string;
  maxSize?: number; // in MB
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  title,
  description,
  acceptedTypes,
  onUpload,
  className,
  maxSize = 50, // 50MB default
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    const acceptedExtensions = acceptedTypes
      .split(",")
      .map((type) => type.trim().toLowerCase());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!acceptedExtensions.includes(fileExtension)) {
      setError(`File type must be one of: ${acceptedTypes}`);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onUpload(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const getIcon = () => {
    if (acceptedTypes.includes(".mp4") || acceptedTypes.includes(".mov")) {
      return Video;
    }
    if (acceptedTypes.includes(".pdf") || acceptedTypes.includes(".doc")) {
      return FileText;
    }
    return Upload;
  };

  const IconComponent = getIcon();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center p-8 text-center",
          "glass rounded-lg border-2 border-dashed border-border/30",
          "cursor-pointer transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10",
          error && "border-destructive/50 bg-destructive/10",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${title}`)?.click()}
      >
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
            "border border-border/30 bg-background/20 backdrop-blur-sm transition-colors",
            isDragOver && "border-primary/50 bg-primary/20",
            error && "border-destructive/50 bg-destructive/20",
          )}
        >
          <IconComponent
            strokeWidth={1.5}
            className={cn(
              "h-8 w-8",
              isDragOver ? "text-primary" : "text-muted-foreground",
              error && "text-destructive",
            )}
          />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>

        <p className="mb-4 text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2">
          <Button className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Choose File
          </Button>

          <p className="text-xs text-muted-foreground">or drag and drop here</p>

          <p className="text-xs text-muted-foreground">
            Accepted formats: {acceptedTypes} • Max size: {maxSize}MB
          </p>
        </div>

        {error && (
          <div className="glass mt-4 rounded-md border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        <input
          id={`file-input-${title}`}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
};
