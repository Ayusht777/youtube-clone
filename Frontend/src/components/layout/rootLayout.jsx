import { Outlet } from "react-router";
import Navbar from "@/components/layout/navbar";
const RootLayout = () => {
  return (
    <div className="bg-background">
      <header>
        <Navbar />
      </header>
      <aside></aside>

      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default RootLayout;
