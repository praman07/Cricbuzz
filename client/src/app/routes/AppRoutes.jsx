import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../../features/auth/ui/screens/Register";
import Login from "../../features/auth/ui/screens/Login";
import DashBoardLayout from "../layouts/DashBoardLayout";
import { useDispatch } from "react-redux";
import { currentUser } from "../../features/auth/state/auth/authAction";
import PublicRoute from "../ProtectedRoutes/PublicRoute";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";
import DashboardHome from "../../features/dashboard/ui/screens/dashboardHome";
import Teams from "../../features/dashboard/ui/screens/Teams";
import Schedule from "../../features/dashboard/ui/screens/Schedule";
import Players from "../../features/dashboard/ui/screens/Players";
import DashboardOverview from "../../features/dashboard/ui/screens/DashboardOverview";
import Admins from "../../features/dashboard/ui/screens/Admins";
import LiveMatches from "../../features/dashboard/ui/screens/LiveMatches";
import Logs from "../../features/dashboard/ui/screens/Logs";
import Settings from "../../features/dashboard/ui/screens/Settings";
import Support from "../../features/dashboard/ui/screens/Support";
import { UserHome } from "../../features/user/ui/pages/UserHome";
import { UserMatchDetails } from "../../features/user/ui/pages/UserMatchDetails";

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
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "",
          element: <UserHome />,
        },
        {
          path: "matches",
          element: <UserHome />,
        },
        {
          path: "matches/:id",
          element: <UserMatchDetails />,
        },
        {
          path: "",
          element: <PublicRoute />,
          children: [
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
              element: <DashboardHome />,
            },
            {
              path: "dashboard",
              element: <DashboardOverview />,
            },
            {
              path: "teams",
              element: <Teams />,
            },
            {
              path: "schedule",
              element: <Schedule />,
            },
            {
              path: "players",
              element: <Players />,
            },
            {
              path: "admins",
              element: <Admins />,
            },
            {
              path: "logs",
              element: <Logs />,
            },
            {
              path: "live",
              element: <LiveMatches />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "support",
              element: <Support />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
