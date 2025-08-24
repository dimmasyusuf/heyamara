"use client";

import { AmaraTable, AmaraTableColumn } from "@/components/table";
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
import CreateCandidateDialog from "./create-candidate-dialog";
import { useGetCandidates } from "@/services/candidate/service";
import { Candidate } from "@prisma/client";
import { format } from "date-fns";
import CandidatesTableAction from "./candidates-table-action";
import { useRouter } from "next/navigation";
import DeleteCandidateDialog from "./delete-candidate-dialog";
import { useState } from "react";
import useGetParams from "@/hooks/use-get-params";

export default function CandidatesTable() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  const { search, limit, offset } = useGetParams();

  const { data, isLoading } = useGetCandidates({
    search,
    limit,
    offset,
  });

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
            onDelete={handleDelete}
          />
        );
      },
    },
  ];

  const handleResume = (candidate: Candidate) => {
    router.push(`/candidates/${candidate.id}/resume`);
  };

  const handleDelete = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setOpen(true);
  };

  const tableActions = (
    <div className="flex items-center gap-2">
      <CreateCandidateDialog />
      {selectedCandidate && (
        <DeleteCandidateDialog
          open={open}
          setOpen={setOpen}
          candidate={selectedCandidate}
        />
      )}
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
