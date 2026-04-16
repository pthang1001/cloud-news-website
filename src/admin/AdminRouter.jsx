import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Dashboard from "./Dashboard/Dashboard";
import ArticlesPage from "./pages/ArticlesPage/ArticlesPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import CommentsPage from "./pages/CommentsPage/CommentsPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { useCurrentAdminPage } from "./hooks/useCurrentAdminPage";

const AdminRouter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentPage = useCurrentAdminPage();

  return (
    <AdminLayout
      currentPage={currentPage}
      collapsed={sidebarCollapsed}
      onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRouter;