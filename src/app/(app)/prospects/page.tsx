import Link from "next/link";

import { AppHeader } from "@/components/header";
import { EmptyState } from "@/components/state";
import { Button } from "@/components/ui/button";

export default function ProspectsPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Prospects", href: "/prospects" }]} />
      <main className="flex flex-1 items-center justify-center p-4">
        <EmptyState
          title="Prospects"
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
