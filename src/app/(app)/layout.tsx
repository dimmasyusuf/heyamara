"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AmaraWidget } from "@/components/widget";

import { cn } from "@/lib/utils";

import { useWidgetStore } from "@/stores/widget";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { open } = useWidgetStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className={cn(
          "transition-all duration-500 ease-in-out",
          open ? "mr-[24rem]" : "mr-0",
        )}
      >
        {children}
      </SidebarInset>
      <AmaraWidget />
    </SidebarProvider>
  );
}
