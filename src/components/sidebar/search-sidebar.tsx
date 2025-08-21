"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { menu } from "./menu";

export default function SearchSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const { open } = useSidebar();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter menu items based on search value
  const filteredMenu = React.useMemo(() => {
    if (!searchValue.trim()) {
      // Show only first 3 items when no search
      return menu.slice(0, 3);
    }
    // Show all items that match the search
    return menu.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem
          className={cn(
            "flex items-center gap-2 transition-all duration-200 ease-linear",
            !open ? "px-2" : "p-0",
          )}
        >
          <SidebarMenuButton
            tooltip="Search"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <IconSearch />
            <span>Search</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            heading={searchValue.trim() ? "Search Results" : "Suggestions"}
          >
            {filteredMenu.map((item) => (
              <CommandItem key={item.title}>
                <item.icon />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
