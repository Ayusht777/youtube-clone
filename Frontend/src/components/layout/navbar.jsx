import { CircleUser, Menu, Youtube } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "../../store/store";
import Avatar from "../shared/avatar/avatar";
import Button from "../shared/Button";
import Search from "../shared/search";
const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
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
          {isAuthenticated ? (
            <Avatar />
          ) : (
            <Button
              className={"rounded-full bg-background text-text-primary"}
              onClick={() => navigate("/auth/login")}
            >
              <CircleUser strokeWidth="1.2" /> Sign In
            </Button>
          )}{" "}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
