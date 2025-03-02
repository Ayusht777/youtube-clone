import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

function DashboardPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AppSidebar>
        <NavMain />
        <NavProjects />
        <NavSecondary />
        <NavUser />
      </AppSidebar>

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dashboard cards/widgets would go here */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
            <p>No recent activity to display.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Statistics</h2>
            <p>Loading statistics...</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Quick Actions</h2>
            <p>No actions available.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
