import { AppHeader } from "@/components/header";
import React from "react";

export default function SettingsPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Settings", href: "/settings" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </main>
    </>
  );
}
