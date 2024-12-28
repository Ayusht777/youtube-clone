import { CircleUser, Menu, Plus, Youtube } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "../../store/store";
import Avatar from "@/components/shared/avatar/avatar";
import Button from "@/components/shared/Button";
import Search from "@/components/shared/search";

const MenuButton = () => (
  <div className="size-10 flex items-center">
    <button className="rounded-full text-text-primary size-6">
      <Menu strokeWidth={1.25} />
    </button>
  </div>
);

const BrandLogo = () => (
  <div className="flex items-center justify-center gap-2 text-text-primary font-medium tracking-tighter">
    <Youtube className="text-social-google" />
    <h1>Youtube Clone</h1>
  </div>
);

const CreateButton = () => (
  <Button className="rounded-full bg-background-light hover:bg-background text-text-primary pr-4">
    <Plus strokeWidth="1.2" />
    Create
  </Button>
);

const AuthSection = ({ isAuthenticated, navigate }) => (
  <div className="flex items-center justify-center gap-2">
    <div>{isAuthenticated && <CreateButton />}</div>
    <div>
      {isAuthenticated ? (
        <Avatar />
      ) : (
        <Button
          className="rounded-full bg-background text-text-primary"
          onClick={() => navigate("/auth/login")}
        >
          <CircleUser strokeWidth="1.2" /> Sign In
        </Button>
      )}
    </div>
  </div>
);

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center py-2 px-4">
      <MenuButton />
      <div className="flex items-center w-full justify-between">
        <BrandLogo />
        <div className="min-w-[580px]">
          <Search />
        </div>
        <AuthSection isAuthenticated={isAuthenticated} navigate={navigate} />
      </div>
    </nav>
  );
};

export default Navbar;
