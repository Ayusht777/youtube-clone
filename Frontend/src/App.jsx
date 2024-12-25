import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "./components/auth/authLayout";
import Login from "./components/auth/login";
import Registered from "./components/auth/registered";
import RootLayout from "./components/layout/rootLayout";
import HomePage from "./pages/homePage";
import NotFound from "./pages/notFoundPage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/register",
        element: <Registered />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <RootLayout />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          error: {
            style: {
              backgroundColor: "#1E1E1E",
              color: "#888888",
              border: "1px solid #333333",
            },
          },
        }}
      />
    </>
  );
};

export default App;
