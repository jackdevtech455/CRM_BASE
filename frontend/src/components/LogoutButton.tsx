import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <button type="button" onClick={handleLogout}>
      Log out
    </button>
  );
}
