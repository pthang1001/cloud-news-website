import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import AuthPage from '../pages/Auth/AuthPage';

export const router = createBrowserRouter([
  { path: '/',          element: <Home /> },
  { path: '/login',     element: <AuthPage mode="login" /> },
  { path: '/register',  element: <AuthPage mode="register" /> },
]);