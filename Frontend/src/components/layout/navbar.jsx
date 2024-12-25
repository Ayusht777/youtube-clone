import { Menu, Youtube } from "lucide-react";
import Avatar from "../shared/avatar/avatar";
import Search from "../shared/search";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center py-2 px-4">
      <div className=" size-10 flex items-center">
        <button className=" rounded-full text-text-primary size-6">
          <Menu strokeWidth={1.25} />
        </button>
      </div>
      <div className="flex items-center  w-full justify-between">
        <div className="flex items-center justify-center gap-2 text-text-primary font-medium tracking-tighter">
          <Youtube className="text-social-google" />
          <h1>Youtube Clone</h1>
        </div>
        <div>
          <Search />
        </div>
        <div>
          <Avatar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
