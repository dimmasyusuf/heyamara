import { AppHeader } from "@/components/header";
import React from "react";

export default function DashboardPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Dashboard", href: "/" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </main>
    </>
  );
}
