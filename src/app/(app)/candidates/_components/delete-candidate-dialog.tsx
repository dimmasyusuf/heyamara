"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Candidate } from "@prisma/client";
import { useDeleteCandidate } from "@/services/candidate";

interface DeleteCandidateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  candidate: Candidate;
}

export default function DeleteCandidateDialog({
  open,
  setOpen,
  candidate,
}: DeleteCandidateDialogProps) {
  const { mutateAsync, isPending } = useDeleteCandidate();

  const onSubmit = async () => {
    const response = await mutateAsync(candidate.id);

    if (response.error) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Candidate</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this candidate?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-none">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full"
              size="lg"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            size="lg"
            variant="destructive"
            className="h-12 w-full"
            disabled={isPending}
            onClick={onSubmit}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
