import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
}