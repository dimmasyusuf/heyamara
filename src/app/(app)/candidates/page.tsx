import { AppHeader } from "@/components/header";

import CandidatesTable from "./_components/candidates-table";

export default async function CandidatesPage() {
  return (
    <>
      <AppHeader breadcrumb={[{ label: "Candidates", href: "/candidates" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto bg-accent p-6">
        <CandidatesTable />
      </main>
    </>
  );
}
