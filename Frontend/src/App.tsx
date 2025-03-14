import { RootLayout } from "@/layouts/RootLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <div className="dark">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<RootLayout />}>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
