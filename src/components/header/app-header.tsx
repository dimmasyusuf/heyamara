"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { IconBell, IconBrain, IconMessage } from "@tabler/icons-react";
import UserPopover from "./user-popover";
import Link from "next/link";
import { useWidgetStore } from "@/stores/widget";
import { useParams, usePathname } from "next/navigation";

interface AppHeaderProps {
  breadcrumb?: {
    label: string;
    href: string;
  }[];
}
export default function AppHeader({ breadcrumb }: AppHeaderProps) {
  const { candidate_id } = useParams<{ candidate_id: string }>();
  const pathName = usePathname();

  const { open, setOpen } = useWidgetStore();

  const showAskAI = pathName.startsWith(`/candidates/${candidate_id}/resume`);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb?.map((item, index) => (
              <React.Fragment key={item.label}>
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumb.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {index !== breadcrumb.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-4">
          {showAskAI && (
            <Button
              type="button"
              variant="outline"
              className="[&_svg]:size-5"
              onClick={() => setOpen(!open)}
            >
              <IconBrain />
              Ask AI
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 [&_svg]:size-5"
            asChild
          >
            <Link href="/communication">
              <IconMessage />
            </Link>
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 [&_svg]:size-5"
          >
            <IconBell />
          </Button>

          <UserPopover />
        </div>
      </div>
    </header>
  );
}
