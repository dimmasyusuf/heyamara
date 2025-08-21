import Link from "next/link";

import { AppHeader } from "@/components/header";
import { EmptyState } from "@/components/state";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Calendar", href: "/calendar" }]} />
      <main className="flex flex-1 items-center justify-center p-4">
        <EmptyState
          title="Calendar"
          description="We're building this page. Please check back soon!"
        >
          <Button variant="outline" asChild>
            <Link href="/candidates">Move to Candidates</Link>
          </Button>
        </EmptyState>
      </main>
    </>
  );
}
