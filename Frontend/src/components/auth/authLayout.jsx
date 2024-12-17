import { Outlet, useLocation, Link } from "react-router";

const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-full md:max-w-sm max-w-xs rounded-lg border border-input-border p-6 flex flex-col ">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-8">
          {isLoginPage ? "Login to YouTube" : "Create Your Account"}
        </h1>

        <div className=" flex items-center justify-center">
          <Outlet />
        </div>

        <div className="text-center text-text-secondary mt-6">
          {isLoginPage ? (
            <p>
              Don't have an account?
              <Link
                to="/auth/register"
                className="text-link hover:text-linkHover ml-1 font-medium"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?
              <Link
                to="/auth/login"
                className="text-link hover:text-linkHover ml-1 font-medium"
              >
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
