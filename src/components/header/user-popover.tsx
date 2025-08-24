"use client";

import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function UserPopover() {
  const { data } = useSession();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={data?.user?.image || ""} />
          <AvatarFallback>{data?.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" className="overflow-hidden p-0">
        <div className="flex cursor-default items-center gap-2 border-b px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarImage src={data?.user?.image || ""} />
            <AvatarFallback translate="no">
              {data?.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex w-full flex-col">
            <span translate="no" className="line-clamp-1 text-sm font-semibold">
              {data?.user?.name}
            </span>
            <span
              translate="no"
              className="line-clamp-1 text-xs leading-none text-muted-foreground"
            >
              {data?.user?.email}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3">
          <Button type="button" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
