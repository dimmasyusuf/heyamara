import { AppHeader } from "@/components/header";
import React from "react";

export default function ProspectsPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Prospects", href: "/prospects" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Prospects</h1>
      </main>
    </>
  );
}
