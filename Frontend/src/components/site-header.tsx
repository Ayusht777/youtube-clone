import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Film, MenuIcon } from "lucide-react";
import { Link } from "react-router";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b px-4"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex h-(--header-height) w-full items-center justify-between">
        {/* Left Section: Sidebar Toggle and Logo */}
        <div className="flex items-center gap-2.5">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
          <Link to="/">
            <div className="bg-red-600 text-white flex aspect-square size-8 items-center justify-center rounded-full">
              <Film className="size-4" />
            </div>
          </Link>
          <div className="hidden md:block text-left text-sm leading-tight">
            <h2 className="truncate font-medium text-white">YouTube Clone</h2>
            <p className="truncate text-xs text-gray-400">
              by
              <a
                href="https://www.linkedin.com/in/ayush-talesara-898655242/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:underline"
              >
                Ayush Talesara
              </a>
            </p>
          </div>
        </div>

        {/* Center Section: Search Form */}
        <div className="flex-1 flex justify-center mx-4">
          <div className="relative w-full max-w-xl">
            <SearchForm>
            </SearchForm>
          </div>
        </div>

        {/* Right Section: Placeholder for Additional Buttons */}
        <div className="flex items-center gap-2">
          {/* Placeholder for Create, Notifications, Profile, etc. */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            {/* Add Create Icon (e.g., Plus) */}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            {/* Add Notifications Icon (e.g., Bell) */}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            {/* Add Profile Icon (e.g., User) */}
          </Button>
        </div>
      </div>
    </header>
  );
}