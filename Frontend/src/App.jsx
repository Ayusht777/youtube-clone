import { createBrowserRouter, RouterProvider } from "react-router";
import Registered from "./components/auth/registered";
import AuthLayout from "./components/auth/authLayout";
import { Toaster } from "react-hot-toast";
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/register",
        element: <Registered />,
      },
      // {
      //   path: "/auth/login",
      //   element: <Login />,
      // },
    ],
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
