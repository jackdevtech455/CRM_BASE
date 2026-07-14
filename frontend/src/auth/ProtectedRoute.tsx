import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}