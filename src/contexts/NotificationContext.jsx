import { createContext, useState, useContext, useEffect, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const getUser = useCallback(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : {};
    } catch (e) { return {}; }
  }, []);

  const fetchNotifications = useCallback(async () => {
    const user = getUser();
    if (!user.email) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${user.email}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) { console.error(err); }
  }, [getUser]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 5000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    const user = getUser();
    if (!user.email || unreadCount === 0) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      if (res.ok) {
        setNotifications(prev => (prev || []).map(n => ({ ...n, is_read: true })));
      }
    } catch (err) { console.error(err); }
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);