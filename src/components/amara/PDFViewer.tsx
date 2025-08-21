"use client";

import React, { useState } from "react";
import { FileText, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  src: string;
  title?: string;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  src,
  title,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center p-8 text-center",
          "rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20",
          className,
        )}
      >
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Unable to load PDF
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          The PDF file could not be displayed. This might be due to browser
          restrictions or file format issues.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FileText className="h-4 w-4" />
          Open in new tab
        </a>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={title || "PDF Document"}
        className="h-full w-full border-0 bg-white dark:bg-neutral-900"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};
