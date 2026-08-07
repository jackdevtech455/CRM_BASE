import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { LogoutButton } from "./LogoutButton";

export function Layout() {
  const { user } = useAuth();

  return (
    <>
      <header>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/tickets">Tickets</Link>

          <span style={{ marginLeft: "auto" }}>
            <Link to="/register">Create Account</Link>
          </span>

          <span style={{ marginLeft: "auto" }}>
            {user?.name} ({user?.email})
          </span>

          <span style={{ marginLeft: "auto" }}>
            <LogoutButton />
          </span>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
