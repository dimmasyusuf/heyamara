import { AppHeader } from "@/components/header";
import { columns, Candidate } from "./_components/table/columns";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

async function getData(): Promise<Candidate[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      date: "2021-01-01",
      pay: 100,
      note: "Note",
      status: "pending",
      rating: 5,
    },
    {
      id: "728ed52f",
      name: "John Doe",
      date: "2021-01-01",
      pay: 100,
      note: "Note",
      status: "pending",
      rating: 5,
    },
  ];
}

export default async function CandidatesPage() {
  const data = await getData();

  return (
    <>
      <AppHeader breadcrumb={[{ label: "Candidates", href: "/candidates" }]} />
      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        <DataTable
          columns={columns}
          data={data}
          action={
            <Button size="sm" asChild>
              <Link href="/candidates/new">
                <span>New</span> <IconPlus />
              </Link>
            </Button>
          }
        />
      </main>
    </>
  );
}
