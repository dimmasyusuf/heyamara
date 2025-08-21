import { AppHeader } from "@/components/header";
import React from "react";

export default function CalendarPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Calendar", href: "/calendar" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
      </main>
    </>
  );
}
