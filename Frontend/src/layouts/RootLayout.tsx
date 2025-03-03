import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container py-6 px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
