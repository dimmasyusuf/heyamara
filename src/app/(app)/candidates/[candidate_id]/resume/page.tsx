"use client";

import { useEffect } from "react";

import { AppHeader } from "@/components/header";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetCandidate } from "@/services/candidate";
import { useParams } from "next/navigation";
import ResumePreview from "./_components/resume-preview";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import ResumeEditor from "./_components/resume-editor";
import { useWidgetStore } from "@/stores/widget";

export default function CreateCandidatePage() {
  const { candidate_id } = useParams<{ candidate_id: string }>();

  const { data: candidate, isLoading: isCandidateLoading } =
    useGetCandidate(candidate_id);

  const { setOpen } = useSidebar();

  const { open: isOpenWidget } = useWidgetStore();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      <AppHeader
        breadcrumb={[
          { label: "Candidates", href: "/candidates" },
          {
            label: `${candidate?.data.name}`,
            href: `/candidates/${candidate_id}`,
          },
        ]}
      />
      <main className="flex h-[calc(100dvh-64px)] overflow-y-auto bg-accent p-6">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border bg-background"
        >
          {!isOpenWidget && (
            <>
              <ResizablePanel defaultSize={40}>
                <ResumePreview candidate={candidate?.data} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel defaultSize={isOpenWidget ? 100 : 60}>
            <ResumeEditor
              candidate={candidate?.data}
              isLoading={isCandidateLoading}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
