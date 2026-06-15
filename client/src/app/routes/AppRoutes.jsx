import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../../features/auth/ui/screens/Register";
import Login from "../../features/auth/ui/screens/Login";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Home from "../../features/home/ui/screen/Home";
import { useDispatch } from "react-redux";
import { currentUser } from "../../features/auth/state/auth/authAction";
import PublicRoute from "../ProtectedRoutes/PublicRoute";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";
import DashboardHome from "../../features/dashboard/ui/screens/dashboardHome";
const AppRoutes = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    (() => {
      try {
        dispatch(currentUser());
      } catch (error) {
        console.log("error in me api", error);
      }
    })();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element:<AuthLayout/>,
      children: [
        {
          path: "",
          element:  <PublicRoute />,
          children: [
            {
              path:'',
              element:<Home />,
            },
            {
              path: "/register",
              element: <Register />,
            },
            {
              path: "/login",
              element: <Login />,
            },
          ],
        },
      ],
    },
    {
      path: "/home",
      element: <DashBoardLayout />,
      children: [
        {
          path: "",
          element: <ProtectedRoute />,
          children: [
            {
              path: "",
              element:<DashboardHome/> ,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
