import { RootLayout } from "@/layouts/RootLayout";
import { Dashboard } from "@/pages/Dashboard";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuthStore } from "@/store/authStore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Authenticated Users Away from Login/Signup */}
        {isAuthenticated ? (
          <>
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            {/* Public Routes (For Non-Authenticated Users) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Private Routes (Only Authenticated Users Can Access) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
