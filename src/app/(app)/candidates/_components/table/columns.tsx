"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconDotsVertical,
  IconNote,
  IconStar,
  IconUser,
} from "@tabler/icons-react";

export type Candidate = {
  id: string;
  name: string;
  date: string;
  pay: number;
  note: string;
  status: "pending" | "processing" | "success" | "failed";
  rating: number;
};

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconUser size={16} />
          <span>Name</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconCalendar size={16} />
          <span>Date</span>
        </div>
      );
    },
  },
  {
    accessorKey: "pay",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconCurrencyDollar size={16} />
          <span>Pay</span>
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconNote size={16} />
          <span>Note</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconClock size={16} />
          <span>Status</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <IconStar size={16} />
          <span>Rating</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="mx-auto h-8 w-8">
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
