// services/articleService.js
import api from "./api";

/**
 * Lấy danh sách bài viết (Đã cập nhật thêm Tìm kiếm và Chuyên mục)
 */
export const getAllArticles = async (category = "Tất cả", search = "", page = 1, limit = 100) => {
  const res = await api.get("/articles", {
    params: { 
        category: category, 
        q: search,
        page, 
        limit 
    },
  });
  return Array.isArray(res.data) ? res.data : res.data.articles || [];
};

/**
 * 🚀 TÍNH NĂNG MỚI: Lấy danh sách tin nổi bật cho Hero & Sidebar
 * Duy cần hàm này để Home.jsx không bị lỗi trắng trang nhé!
 */
export const getTopArticles = async () => {
  const res = await api.get("/top-articles");
  return res.data;
};

/**
 * Lấy chi tiết bài viết theo ID (ID bây giờ là mã Hex Duy nhé)
 */
export const getArticleById = async (id) => {
  const res = await api.get(`/articles/${id}`);
  return res.data;
};

/**
 * Lấy danh sách bài viết liên quan
 */
export const getRelatedArticles = async (articleId, limit = 3) => {
  const res = await api.get(`/articles/${articleId}/related`, {
    params: { limit },
  });
  return res.data;
};

/**
 * Lấy danh sách bình luận
 */
export const getComments = async (articleId) => {
  const res = await api.get(`/articles/${articleId}/comments`);
  return res.data;
};

/**
 * Gửi bình luận mới
 */
export const postComment = async (articleId, text) => {
  const res = await api.post(`/articles/${articleId}/comments`, { text });
  return res.data;
};

/**
 * Thích / bỏ thích bình luận
 */
export const toggleLikeComment = async (commentId) => {
  const res = await api.post(`/comments/${commentId}/like`);
  return res.data;
};