import { Outlet } from "react-router";
import Navbar from "@/components/layout/navbar";
import SideNavbar from "@/components/layout/sideNavbar";
const RootLayout = () => {
  return (
    <div className="bg-background">
      <header>
        <Navbar />
      </header>
      <div className="flex ">
        <aside>
          <SideNavbar />
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
      <footer></footer>
    </div>
  );
};

export default RootLayout;
