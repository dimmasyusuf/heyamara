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
  title: string;
  url: string;
  icon: React.ElementType;
}

export const menu: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
  {
    title: "Candidates",
    url: "/candidates",
    icon: IconUsers,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: IconBriefcase,
  },
  {
    title: "Prospects",
    url: "/prospects",
    icon: IconDatabase,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: IconCalendar,
  },
  {
    title: "Communication",
    url: "/communication",
    icon: IconMessage,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },

  {
    title: "Trash",
    url: "/trash",
    icon: IconTrash,
  },
];
