"use client";

import React from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFViewer } from "./PDFViewer";

interface SplitScreenViewerProps {
  originalSrc: string;
  formattedSrc: string;
  originalTitle?: string;
  formattedTitle?: string;
  className?: string;
}

export const SplitScreenViewer: React.FC<SplitScreenViewerProps> = ({
  originalSrc,
  formattedSrc,
  originalTitle = "Original CV",
  formattedTitle = "Formatted CV",
  className,
}) => {
  return (
    <div className={cn("h-full w-full", className)}>
      <PanelGroup direction="horizontal" className="h-full">
        {/* Original CV Panel */}
        <Panel defaultSize={50} minSize={25}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/30 bg-transparent px-4 py-3">
              <h3 className="text-sm font-medium text-foreground">
                {originalTitle}
              </h3>
            </div>
            <div className="flex-1 p-4">
              <PDFViewer
                src={originalSrc}
                title={originalTitle}
                className="h-full rounded-md border border-border/20"
              />
            </div>
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="group relative w-2 bg-border/20 transition-colors hover:bg-border/40">
          <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-border/50 transition-colors group-hover:bg-border/80" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        </PanelResizeHandle>

        {/* Formatted CV Panel */}
        <Panel defaultSize={50} minSize={25}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/30 bg-transparent px-4 py-3">
              <h3 className="text-sm font-medium text-foreground">
                {formattedTitle}
              </h3>
            </div>
            <div className="flex-1 p-4">
              <PDFViewer
                src={formattedSrc}
                title={formattedTitle}
                className="h-full rounded-md border border-border/20"
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
