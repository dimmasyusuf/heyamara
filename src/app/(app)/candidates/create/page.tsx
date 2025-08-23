"use client";

import { useEffect } from "react";

import { AppHeader } from "@/components/header";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EmptyState } from "@/components/state";
import CVPreview from "./_components/cv-preview";

export default function CreateCandidatePage() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <AppHeader
        breadcrumb={[
          { label: "Candidates", href: "/candidates" },
          { label: "Create", href: "/candidates/create" },
        ]}
      />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <CVPreview />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <EmptyState
              title="No CV uploaded"
              description="Upload a CV to get started"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
