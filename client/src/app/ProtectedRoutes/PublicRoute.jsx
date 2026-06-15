import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const PublicRoute = () => {
    let { employee, isLoading } = useSelector((store) => store.auth);
    const location = useLocation();

    if (isLoading) return <h1>Loading...</h1>;

    const path = location.pathname;

    // Register route is mounted at `/` — only SUPER_ADMIN can access it and must be authenticated
    if (path === "/") {
        if (!employee) return <Navigate to="/login" />;
        if (employee && employee.role !== "SUPER_ADMIN") return <Navigate to="/home" />;
        return <Outlet />;
    }

    // Default public behavior: if already authenticated redirect to home
    if (employee) return <Navigate to="/home" />;

    return <Outlet />;
};

export default PublicRoute;
