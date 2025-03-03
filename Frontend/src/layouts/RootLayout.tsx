import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
