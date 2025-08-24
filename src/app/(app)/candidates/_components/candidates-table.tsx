"use client";

import { AmaraTable, AmaraTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  IconBriefcase,
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconMapPin,
  IconNotes,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import CreateCandidateDialog from "./create-candidate-dialog";
import { useGetCandidates } from "@/services/candidate/service";
import { Candidate } from "@prisma/client";
import { format } from "date-fns";
import CandidatesTableAction from "./candidates-table-action";
import { useRouter } from "next/navigation";

export default function CandidatesTable() {
  const router = useRouter();

  const { data, isLoading } = useGetCandidates();

  const tableColumns: AmaraTableColumn[] = [
    {
      key: "name",
      icon: <IconUser />,
      header: "Name",
      sortable: true,
    },
    {
      key: "role",
      icon: <IconBriefcase />,
      header: "Role",
      sortable: true,
    },
    {
      key: "location",
      icon: <IconMapPin />,
      header: "Location",
      sortable: true,
    },
    {
      key: "date",
      icon: <IconCalendar />,
      header: "Date",
      sortable: true,
      cell: (data: Candidate) => {
        return <div>{format(data.date, "MM/dd/yyyy")}</div>;
      },
    },
    {
      key: "pay",
      icon: <IconCurrencyDollar />,
      header: "Pay",
      sortable: true,
    },
    {
      key: "notes",
      icon: <IconNotes />,
      header: "Notes",
      sortable: true,
    },
    {
      key: "status",
      icon: <IconClock />,
      header: "Status",
      sortable: true,
    },
    {
      key: "rating",
      icon: <IconStar />,
      header: "Rating",
      sortable: true,
    },
    {
      key: "",
      header: "",
      cell: (data: Candidate) => {
        return (
          <CandidatesTableAction
            candidate={data}
            onResume={handleResume}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      },
    },
  ];

  const handleResume = (candidate: Candidate) => {
    router.push(`/candidates/${candidate.id}/resume`);
  };

  const handleView = (candidate: Candidate) => {
    router.push(`/candidates/${candidate.id}`);
  };

  const handleEdit = (candidate: Candidate) => {
    router.push(`/candidates/${candidate.id}/edit`);
  };

  const handleDelete = (candidate: Candidate) => {
    console.log(candidate);
  };

  const tableActions = (
    <div className="flex items-center gap-2">
      <CreateCandidateDialog />

      <Button asChild>
        <Link href="/candidates/create">First</Link>
      </Button>

      <Button>Second</Button>
    </div>
  );

  return (
    <AmaraTable
      id="candidates"
      columns={tableColumns}
      data={data?.data || []}
      pagination={data?.pagination}
      isLoading={isLoading}
      actions={tableActions}
    />
  );
}
