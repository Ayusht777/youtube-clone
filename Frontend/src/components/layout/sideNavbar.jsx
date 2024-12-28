import { NavLink } from "react-router";
import { Home, PlaySquare, Clock, ListPlus, CircleUser } from "lucide-react";
import { cn } from "@/utils/cn";
import useLayoutStore from "@/store/useLayoutStore";

const NavigationItemDetails = [
  { name: "Home", path: "/", Icon: Home },
  { name: "Subscriptions", path: "/subscriptions", Icon: PlaySquare },
  { name: "History", path: "/history", Icon: Clock },
  { name: "Playlist", path: "/Playlist", Icon: ListPlus },
  { name: "You", path: "/you", Icon: CircleUser },
];

const NavigationItem = ({ name, path, Icon }) => {
  const isSidebarOpen = useLayoutStore((state) => state.isSidebarOpen);
  
  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <button
          className={cn(
            "w-full  flex text-text-primary  items-center bg-background rounded-lg  hover:bg-background-light",
            isActive ? "bg-background-light" : "",
            !isSidebarOpen ? "flex-col py-4 gap-y-0.5" :"gap-x-4 px-2.5 min-h-10"
          )}
        >
          <div className="">
            <Icon strokeWidth={1.2} />
          </div>
          {isSidebarOpen ? (
            <span className="text-start w-full">{name}</span>
          ) : (
            <span className=" text-[10px] ">{name}</span>
          )}
        </button>
      )}
    </NavLink>
  );
};

const SideNavbar = () => {
  const isSidebarOpen = useLayoutStore((state) => state.isSidebarOpen);

  return (
    <div
      className={cn(
        "bg-inherit h-full ",
        isSidebarOpen ? "w-56 p-3.5" : "w-auto p-1"
      )}
    >
      {NavigationItemDetails.map((item) => (
        <NavigationItem
          key={item.path}
          name={item.name}
          path={item.path}
          Icon={item.Icon}
        />
      ))}
    </div>
  );
};

export default SideNavbar;
