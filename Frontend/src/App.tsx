import { RootLayout } from "@/layouts/RootLayout";
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/profile-page";
import SignupPage from "@/pages/signup";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuthStore } from "@/store/authStore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace={true} />
            ) : (
              <SignupPage />
            )
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/" : "/login"} replace={true} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
