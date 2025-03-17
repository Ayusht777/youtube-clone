import { RootLayout } from "@/layouts/RootLayout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/routes/protected-route";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import HomePage from "@/pages/home";
import { useEffect } from "react";

function App() {
  const { verifyAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    verifyAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} 
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
