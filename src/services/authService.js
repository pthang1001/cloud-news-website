const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Đăng nhập với email + mật khẩu
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

  // Lưu token vào localStorage
  if (data.token) {
    localStorage.setItem("access_token", data.token);
  }

  return data;
}

/**
 * Đăng ký tài khoản mới
 * @returns {Promise<{ message: string, user: object }>}
 */
export async function register(fullname, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

  return data;
}

/**
 * Đăng xuất - xóa token khỏi localStorage
 */
export function logout() {
  localStorage.removeItem("access_token");
}

/**
 * Lấy token hiện tại
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem("access_token");
}

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Lấy thông tin user hiện tại từ server
 */
export async function getCurrentUser() {
  const token = getToken();
  if (!token) throw new Error("Chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể lấy thông tin người dùng");

  return data;
}