import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFile,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Candidate } from "@prisma/client";

interface CandidatesTableActionProps {
  candidate: Candidate;
  onResume: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

export default function CandidatesTableAction({
  candidate,
  onResume,
  onEdit,
  onDelete,
}: CandidatesTableActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onResume(candidate)}>
          <IconFile />
          Resume
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(candidate)}>
          <IconEdit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onDelete(candidate)}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
