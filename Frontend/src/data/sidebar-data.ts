import {
  BarChart,
  Bell,
  Heart,
  History,
  Home,
  ListVideo,
  Settings,
  User,
  Video,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: Bell,
    },
    {
      title: "Videos",
      url: "/videos",
      icon: Video,
    },
    {
      title: "Playlists",
      url: "/playlists",
      icon: ListVideo,
    },
    {
      title: "Community",
      url: "/community",
      icon: User,
    },

    {
      title: "History",
      url: "/history",
      icon: History,
    },
    {
      title: "Liked Videos",
      url: "/liked-videos",
      icon: Heart,
    },

    {
      title: "Channel Analytics",
      url: "/channel-stats",
      icon: BarChart,
    },
  ],
  navSecondary: [
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};
