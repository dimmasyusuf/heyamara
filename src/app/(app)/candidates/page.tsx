import { AppHeader } from "@/components/header";
import React from "react";

export default function CandidatesPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Candidates", href: "/candidates" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Candidates</h1>
      </main>
    </>
  );
}
