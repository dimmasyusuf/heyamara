import { AppHeader } from "@/components/header";

export default async function CreateCandidatePage() {
  return (
    <>
      <AppHeader
        breadcrumb={[
          { label: "Candidates", href: "/candidates" },
          { label: "Create", href: "/candidates/create" },
        ]}
      />
      <main className="flex flex-1 flex-col overflow-y-auto p-6"></main>
    </>
  );
}
