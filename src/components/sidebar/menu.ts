import {
  IconCalendar,
  IconDatabase,
  IconMessage,
  IconSettings,
  IconTrash,
  IconUsers,
  IconDashboard,
  IconBriefcase,
} from "@tabler/icons-react";

export interface MenuItem {
  icon: React.ElementType;
  title: string;
  href: string;
}

export const menu: MenuItem[] = [
  {
    icon: IconDashboard,
    title: "Dashboard",
    href: "/",
  },
  {
    icon: IconUsers,
    title: "Candidates",
    href: "/candidates",
  },
  {
    icon: IconBriefcase,
    title: "Clients",
    href: "/clients",
  },
  {
    icon: IconDatabase,
    title: "Prospects",
    href: "/prospects",
  },
  {
    icon: IconCalendar,
    title: "Calendar",
    href: "/calendar",
  },
  {
    icon: IconMessage,
    title: "Communication",
    href: "/communication",
  },
  {
    icon: IconSettings,
    title: "Settings",
    href: "/settings",
  },

  {
    icon: IconTrash,
    title: "Trash",
    href: "/trash",
  },
];
