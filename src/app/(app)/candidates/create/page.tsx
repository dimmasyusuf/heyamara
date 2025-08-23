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
import CVPreview from "./_components/resume-preview";
import { useCandidateStore } from "@/stores/candidate";
import { Button } from "@/components/ui/button";
import { useAnalyzeResume } from "@/services/candidate";
import { Response } from "@/components/ai-elements/response";
import { AmaraSpinner } from "@/components/spinner";

export default function CreateCandidatePage() {
  const { setOpen } = useSidebar();

  const { files } = useCandidateStore();

  const { data, mutateAsync, isPending } = useAnalyzeResume();

  const handleAnalyzeResume = async () => {
    if (files.length === 0) return;
    const file = files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    const result = await mutateAsync(formData);

    console.log(result);
  };

  console.log("data:", data);

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
            {data && <Response>{data.data?.content}</Response>}

            {isPending && (
              <div className="flex h-full flex-col items-center justify-center">
                <AmaraSpinner />
              </div>
            )}

            {files.length > 0 && (
              <EmptyState
                title={
                  files.length > 0 ? "Ready to Analyze" : "Upload a Resume"
                }
                description={
                  files.length > 0
                    ? "Resume uploaded! Click below to analyze and uncover valuable candidate insights in seconds."
                    : "Upload a candidate's resume to get started. We accept PDF, DOC, or DOCX files—making it easy to kick off your hiring process."
                }
              >
                {files.length > 0 && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAnalyzeResume}
                  >
                    Analyze Resume
                  </Button>
                )}
              </EmptyState>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
