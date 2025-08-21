"use client";

import * as React from "react";

import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/brand/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import SearchSidebar from "./search-sidebar";
import { menu } from "./menu";

export default function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex h-8 shrink-0 items-center gap-2">
              <Image src={Logo} height={32} width={32} alt="Logo" />
              <span
                className={cn(
                  "transform overflow-hidden text-base font-semibold transition-all duration-500 ease-in-out",
                  !open
                    ? "w-0 -translate-x-2 opacity-0"
                    : "w-auto translate-x-0 opacity-100",
                )}
              >
                Hey Amara
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupContent className="space-y-4">
            <SearchSidebar />

            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200 ease-linear",
                    !open ? "px-2" : "p-0",
                  )}
                >
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
