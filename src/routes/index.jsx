import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import AuthPage from '../pages/Auth/AuthPage';
import ArticleDetail from "../pages/ArticleDetail/ArticleDetail";
import ProfilePage from "../pages/Profile/ProfilePage";

export const router = createBrowserRouter([
  { path: '/',          element: <Home /> },
  { path: '/login',     element: <AuthPage mode="login" /> },
  { path: '/register',  element: <AuthPage mode="register" /> },
  { path: "article/:id", element: <ArticleDetail /> },
  { path: "/profile",    element: <ProfilePage /> },
]);