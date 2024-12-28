import { Plus } from "lucide-react";
const SidebarButton = () => {
  return (
    <button className="w-full px-4 flex ">
      <div className=" size-6"><Plus></Plus></div>
      <span>Home</span>
    </button>
  );
};
const SideNavbar = () => {
  return (
    <div className=" min-w-60 w-full bg-red-500 h-full p-3">
      <SidebarButton></SidebarButton>
    </div>
  );
};

export default SideNavbar;
