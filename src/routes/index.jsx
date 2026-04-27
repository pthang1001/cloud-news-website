import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import AuthPage from '../pages/Auth/AuthPage';
import ArticleDetail from "../pages/ArticleDetail/ArticleDetail";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminRouter from "../admin/AdminRouter";
// FIX: Import trang Lịch sử để sử dụng Duy nhé
import HistoryPage from "../pages/History/HistoryPage"; 

export const router = createBrowserRouter([
  { path: '/',           element: <Home /> },
  { path: '/auth',      element: <AuthPage mode="login" /> },
  { path: '/login',     element: <AuthPage mode="login" /> },
  { path: '/register',  element: <AuthPage mode="register" /> },
  { path: "/article/:id", element: <ArticleDetail /> },
  { path: "/profile",    element: <ProfilePage /> },
  
  // FIX: Thêm đường dẫn cho trang Lịch sử bài báo đã lưu
  { path: "/history",    element: <HistoryPage /> },

  { path: "/admin/*",    element: <AdminRouter /> },
  { path: "/search",     element: <Home /> },
  { path: "/:category", element: <Home /> }
]);