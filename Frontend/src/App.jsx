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
      <Toaster />
    </>
  );
};

export default App;
