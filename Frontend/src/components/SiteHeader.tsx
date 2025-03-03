"use client";

import { SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/SearchForm";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[--header-height] w-full items-center gap-4 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <SearchForm className="w-full max-w-[400px] lg:w-[400px]" />
      </div>
    </header>
  );
}
