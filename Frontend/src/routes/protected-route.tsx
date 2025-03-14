import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
