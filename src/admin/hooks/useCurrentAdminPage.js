import { useLocation } from "react-router-dom";

export const useCurrentAdminPage = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Extract the page name from /admin/* paths
  if (pathname === "/admin" || pathname === "/admin/") {
    return "dashboard";
  }

  const match = pathname.match(/^\/admin\/([a-z]+)/);
  return match ? match[1] : "dashboard";
};
