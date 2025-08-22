import { AmaraTable, AmaraTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconNotes,
  IconPlus,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

export default function CandidatesTable() {
  const tableColumns: AmaraTableColumn[] = [
    {
      key: "name",
      icon: <IconUser />,
      header: "Name",
      sortable: true,
    },
    {
      key: "date",
      icon: <IconCalendar />,
      header: "Date",
      sortable: true,
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
    },
  ];

  const tableData = [
    {
      name: "John Doe",
      date: "2021-01-01",
      pay: "$100",
      notes: "Lorem ipsum dolor sit amet",
      status: "Active",
      rating: 4.5,
    },
    {
      name: "Jane Doe",
      date: "2021-01-02",
      pay: "$200",
      notes: "Lorem ipsum dolor sit amet",
      status: "Inactive",
      rating: 3.5,
    },
    {
      name: "John Doe",
      date: "2021-01-01",
      pay: "$100",
      notes: "Lorem ipsum dolor sit amet",
      status: "Active",
      rating: 4.5,
    },
    {
      name: "Jane Doe",
      date: "2021-01-02",
      pay: "$200",
      notes: "Lorem ipsum dolor sit amet",
      status: "Inactive",
      rating: 3.5,
    },
    {
      name: "John Doe",
      date: "2021-01-01",
      pay: "$100",
      notes: "Lorem ipsum dolor sit amet",
      status: "Active",
      rating: 4.5,
    },
    {
      name: "Jane Doe",
      date: "2021-01-02",
      pay: "$200",
      notes: "Lorem ipsum dolor sit amet",
      status: "Inactive",
      rating: 3.5,
    },
    {
      name: "John Doe",
      date: "2021-01-01",
      pay: "$100",
      notes: "Lorem ipsum dolor sit amet",
      status: "Active",
      rating: 4.5,
    },
    {
      name: "Jane Doe",
      date: "2021-01-02",
      pay: "$200",
      notes: "Lorem ipsum dolor sit amet",
      status: "Inactive",
      rating: 3.5,
    },
  ];

  const tablePagination = {
    page: 1,
    per_page: 10,
    total: 10,
    total_pages: 1,
  };

  const tableActions = (
    <div className="flex items-center gap-2">
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
      data={[]}
      pagination={tablePagination}
      isLoading={false}
      actions={tableActions}
    />
  );
}
