import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
