import { AppHeader } from "@/components/header";
import React from "react";

export default function CommunicationPage() {
  return (
    <>
      <AppHeader
        breadcrumb={[{ label: "Communication", href: "/communication" }]}
      />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Communication</h1>
      </main>
    </>
  );
}
