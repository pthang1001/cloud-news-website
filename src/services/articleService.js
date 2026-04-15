// services/articleService.js
import api from "./api";

/**
 * Lấy chi tiết bài viết theo ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const getArticleById = async (id) => {
  const res = await api.get(`/articles/${id}`);
  return res.data;
};

/**
 * Lấy danh sách bài viết liên quan
 * @param {string|number} articleId
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const getRelatedArticles = async (articleId, limit = 3) => {
  const res = await api.get(`/articles/${articleId}/related`, {
    params: { limit },
  });
  return res.data;
};

/**
 * Lấy danh sách bình luận của bài viết
 * @param {string|number} articleId
 * @returns {Promise<Array>}
 */
export const getComments = async (articleId) => {
  const res = await api.get(`/articles/${articleId}/comments`);
  return res.data;
};

/**
 * Gửi bình luận mới
 * @param {string|number} articleId
 * @param {string} text
 * @returns {Promise<Object>}
 */
export const postComment = async (articleId, text) => {
  const res = await api.post(`/articles/${articleId}/comments`, { text });
  return res.data;
};

/**
 * Thích / bỏ thích bình luận
 * @param {string|number} commentId
 * @returns {Promise<Object>}
 */
export const toggleLikeComment = async (commentId) => {
  const res = await api.post(`/comments/${commentId}/like`);
  return res.data;
};