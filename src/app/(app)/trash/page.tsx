import { AppHeader } from "@/components/header";
import React from "react";

export default function TrashPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Trash", href: "/trash" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Trash</h1>
      </main>
    </>
  );
}
