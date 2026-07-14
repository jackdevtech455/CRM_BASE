import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import ClientsPage from "./pages/ClientsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketsPage from "./pages/TicketsPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: "/",
                        element: <DashboardPage />,
                    },
                    {
                        path: "/clients",
                        element: <ClientsPage />,
                    },
                    {
                        path: "/tickets",
                        element: <TicketsPage />,
                    },
                ],
            },
        ],
    },
]);