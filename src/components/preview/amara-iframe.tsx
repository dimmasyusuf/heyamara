"use client";

import React, { useState } from "react";
import { FileText, AlertCircle, Download, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
// import { AmaraSpinner } from "../spinner";
import Link from "next/link";

interface AmaraIframeProps {
  src: string;
  title?: string;
  className?: string;
}

export default function AmaraIframe({
  src,
  title,
  className,
}: AmaraIframeProps) {
  //   const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  //   const handleLoad = () => {
  //     setIsLoading(false);
  //     setHasError(false);
  //   };

  const handleError = () => {
    // setIsLoading(false);
    setHasError(true);
  };

  // Blob URL
  const isBlobUrl = src.startsWith("blob:");

  if (isBlobUrl) {
    return (
      <object
        data={src}
        type="application/pdf"
        className={cn("h-full w-full", className)}
        //   onLoad={handleLoad}
        onError={handleError}
      >
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your browser doesn't support PDF preview.
            </p>
            <a
              href={src}
              download={title || "document.pdf"}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </div>
        </div>
      </object>
    );
  }

  // Error
  if (hasError) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 p-8 text-center",
          className,
        )}
      >
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Unable to load PDF
        </h3>
        <p className="mb-4 text-balance text-sm text-muted-foreground">
          The PDF file could not be displayed. This might be due to browser
          restrictions or file format issues.
        </p>
        <Link
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FileTextIcon className="h-4 w-4" />
          Open in new tab
        </Link>
      </div>
    );
  }

  // Server URL
  return (
    <iframe
      src={src}
      title={title}
      className={cn(
        "h-full w-full border-0 bg-white dark:bg-neutral-900",
        className,
      )}
      // onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      allowFullScreen
    />
  );
}
