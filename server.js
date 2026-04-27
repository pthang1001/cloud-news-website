// press-backend/server.js
const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const mongoose = require('mongoose');
const { Pool } = require('pg');

const app = express();
const parser = new Parser();

// --- 1. KẾT NỐI DATABASE ---

// MongoDB (Lưu User)
mongoose.connect('mongodb://localhost:27017/press_users_db')
  .then(() => console.log('✅ MongoDB: Đã kết nối press_users_db'))
  .catch(err => console.error('❌ Lỗi MongoDB:', err));

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: { type: String }, // Có thể null nếu dùng Social Login
  avatar: String,
  joinDate: String,
  role: { type: String, default: "Subscriber" },
  status: { type: String, default: "Ngoại tuyến" },
  // ✅ CẬP NHẬT: Thêm để hỗ trợ xác thực Google/Facebook Duy nhé
  provider: { type: String, default: "local" }, 
  socialId: { type: String } 
});
const User = mongoose.model('User', userSchema);

// PostgreSQL (Lưu Bài viết & Bình luận)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'press_news_db', 
  password: '123456', 
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Lỗi PostgreSQL Duy ơi!', err.message);
  } else {
    console.log('✅ PostgreSQL: Đã kết nối press_news_db thành công');
  }
});

// --- 2. CẤU HÌNH MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const RSS_URLS = {
  'Tất cả': 'https://vnexpress.net/rss/tin-moi-nhat.rss',
  'Nổi bật': 'https://vnexpress.net/rss/tin-noi-bat.rss',
  'Thời sự': 'https://vnexpress.net/rss/thoi-su.rss',
  'Thể thao': 'https://vnexpress.net/rss/the-thao.rss',
  'Công nghệ': 'https://vnexpress.net/rss/so-hoa.rss',
  'Kinh doanh': 'https://vnexpress.net/rss/kinh-doanh.rss',
  'Giải trí': 'https://vnexpress.net/rss/giai-tri.rss'
};

const extractImage = (content) => {
  const match = content.match(/src="([^"]+)"/);
  return match ? match[1] : "https://images.unsplash.com/photo-1504711432869-5d39a110fdd0?w=600&q=80";
};

// --- 3. API NGƯỜI DÙNG (MONGODB) ---

app.post('/api/auth/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại Duy ơi!" });
    
    const newUser = new User({
      fullname, email, password,
      avatar: "https://i.pravatar.cc/150?u=" + email,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      status: "Ngoại tuyến"
    });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) { res.status(500).json({ message: "Lỗi đăng ký!" }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email, password },
      { status: "Đang hoạt động" },
      { new: true }
    );
    if (user) {
      console.log(`👤 ${user.fullname} vừa online`);
      res.json({ token: "token-2026-press", user });
    } else res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
  } catch (err) { res.status(500).json({ message: "Lỗi server!" }); }
});

app.post('/api/auth/social-login', async (req, res) => {
  const { fullname, email, avatar, provider, socialId } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { socialId }] });
    if (user) {
      user.status = "Đang hoạt động"; // ✅ FIX: Đã sửa lại typo Duy nhé
      await user.save();
    } else {
      user = new User({
        fullname, email,
        avatar: avatar || "https://i.pravatar.cc/150?u=" + email,
        provider, socialId,
        joinDate: new Date().toLocaleDateString('vi-VN'),
        status: "Đang hoạt động"
      });
      await user.save();
    }
    console.log(`🌐 User ${user.fullname} đã đăng nhập qua ${provider}`);
    res.json({ token: `token-2026-${provider}`, user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập social Duy ơi!" });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const { email } = req.body;
  try {
    await User.findOneAndUpdate({ email }, { status: "Ngoại tuyến" });
    res.json({ message: "Đã đăng xuất" });
  } catch (err) { res.status(500).json({ message: "Lỗi!" }); }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const user = await User.findOne().sort({ _id: -1 }); 
    res.json(user);
  } catch (err) { res.status(500).json({ message: "Lỗi!" }); }
});

app.put('/api/auth/update-avatar', async (req, res) => {
  const { email, avatar } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate({ email }, { avatar }, { new: true });
    if (updatedUser) res.json({ message: "Thành công!", avatar: updatedUser.avatar });
    else res.status(404).json({ message: "Không thấy người dùng!" });
  } catch (err) { res.status(500).json({ message: "Lỗi!" }); }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Lỗi lấy danh sách!" }); }
});

app.put('/api/auth/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, password: oldPassword });
    if (!user) return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác Duy ơi!" });
    const isDuplicate = await User.findOne({ password: newPassword });
    if (isDuplicate) return res.status(400).json({ message: "Mật khẩu này đã có người sử dụng. Duy chọn mật khẩu khác nhé!" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) { res.status(500).json({ message: "Lỗi server đổi mật khẩu!" }); }
});

// --- 4. API BÀI VIẾT & LỊCH SỬ (RSS + POSTGRESQL) ---

app.get('/api/articles', async (req, res) => {
  const { category, q } = req.query;
  const targetUrl = RSS_URLS[category] || RSS_URLS['Tất cả'];
  try {
    const feed = await parser.parseURL(targetUrl);
    let articles = feed.items.map((item) => ({
      id: Buffer.from(item.title).toString('hex').substring(0, 12),
      title: item.title,
      excerpt: item.contentSnippet,
      image: extractImage(item.content),
      category: (category && category !== 'Tất cả') ? category : "Tin nóng",
      author: { name: item.creator || "Ban biên tập VnExpress", avatar: "/VnExpress-logo-1.png" },
      created_at: item.isoDate
    }));
    if (q) articles = articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
    res.json(articles);
  } catch (error) { 
    console.error("Lỗi RSS:", error);
    res.json([]); 
  }
});

app.get('/api/top-articles', async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_URLS['Nổi bật']);
    const articles = feed.items.map((item) => ({
      id: Buffer.from(item.title).toString('hex').substring(0, 12),
      title: item.title,
      excerpt: item.contentSnippet,
      image: extractImage(item.content),
      category: "Nổi bật",
      author: { name: item.creator || "Ban biên tập VnExpress", avatar: "/VnExpress-logo-1.png" },
      created_at: item.isoDate
    }));
    res.json(articles);
  } catch (error) { res.json([]); }
});

app.post('/api/articles/save', async (req, res) => {
  const { article, userEmail } = req.body;
  if (!article || !userEmail) return res.status(400).json({ message: "Thiếu dữ liệu!" });
  const { id, title, excerpt, image, category, author } = article;
  try {
    await pool.query(
      `INSERT INTO saved_articles (article_id, user_email, title, excerpt, image, category, author_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
      [id, userEmail, title, excerpt, image, category, author?.name || "VnExpress"]
    );
    res.json({ message: "Đã lưu PostgreSQL!" });
  } catch (error) { res.status(500).json({ message: "Lỗi PostgreSQL!" }); }
});

app.get('/api/articles/saved/:email', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM saved_articles WHERE user_email = $1 ORDER BY created_at DESC', 
      [req.params.email]
    );
    const mapped = result.rows.map(row => ({
      id: row.article_id, title: row.title, excerpt: row.excerpt, image: row.image, category: row.category,
      author: { name: row.author_name, avatar: "/VnExpress-logo-1.png" }
    }));
    res.json(mapped);
  } catch (error) { res.status(500).json({ message: "Lỗi lịch sử!" }); }
});

app.delete('/api/articles/save/:articleId/:email', async (req, res) => {
  try {
    await pool.query('DELETE FROM saved_articles WHERE article_id = $1 AND user_email = $2', [req.params.articleId, req.params.email]);
    res.json({ message: "Đã xóa khỏi PostgreSQL!" });
  } catch (error) { res.status(500).json({ message: "Lỗi xóa bài!" }); }
});

// --- 5. API BÌNH LUẬN NÂNG CAO (POSTGRESQL) ---

app.post('/api/articles/comments', async (req, res) => {
  const { articleId, userEmail, userName, userAvatar, content, parentId } = req.body;
  if (!content) return res.status(400).json({ message: "Duy ơi, nội dung bình luận trống!" });
  try {
    await pool.query(
      `INSERT INTO comments (article_id, user_email, user_name, user_avatar, content, parent_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [articleId, userEmail, userName, userAvatar, content, parentId || null]
    );
    res.json({ message: "Đã đăng bình luận thành công!" });
  } catch (error) { res.status(500).json({ message: "Lỗi server!" }); }
});

app.post('/api/articles/comments/:id/like', async (req, res) => {
  const { userEmail } = req.body;
  const commentId = req.params.id;
  if (!userEmail) return res.status(400).json({ message: "Chưa có email Duy nhé!" });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const check = await client.query('SELECT * FROM comment_likes WHERE comment_id = $1 AND user_email = $2', [commentId, userEmail]);
    if (check.rows.length > 0) {
      await client.query('DELETE FROM comment_likes WHERE comment_id = $1 AND user_email = $2', [commentId, userEmail]);
      const resUpdate = await client.query('UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING likes', [commentId]);
      await client.query('COMMIT');
      res.json({ action: 'unliked', likes: resUpdate.rows[0].likes });
    } else {
      await client.query('INSERT INTO comment_likes (comment_id, user_email) VALUES ($1, $2)', [commentId, userEmail]);
      const resUpdate = await client.query('UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING likes', [commentId]);
      await client.query('COMMIT');
      res.json({ action: 'liked', likes: resUpdate.rows[0].likes });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: "Lỗi like!" });
  } finally { client.release(); }
});

app.post('/api/articles/comments/:id/report', async (req, res) => {
  try {
    await pool.query('UPDATE comments SET is_reported = TRUE WHERE id = $1', [req.params.id]);
    res.json({ message: "Đã gửi báo cáo cho Admin!" });
  } catch (error) { res.status(500).json({ message: "Lỗi gửi báo cáo!" }); }
});

app.delete('/api/articles/comments/:id/report', async (req, res) => {
  try {
    await pool.query('UPDATE comments SET is_reported = FALSE WHERE id = $1', [req.params.id]);
    res.json({ message: "Đã gỡ tố cáo!" });
  } catch (error) { res.status(500).json({ message: "Lỗi gỡ tố cáo!" }); }
});

app.delete('/api/articles/comments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: "Đã xóa bình luận!" });
  } catch (error) { res.status(500).json({ message: "Lỗi xóa!" }); }
});

app.get('/api/admin/reported-comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments WHERE is_reported = TRUE ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ message: "Lỗi!" }); }
});

app.get('/api/articles/:id/comments', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC', 
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) { res.status(500).json({ message: "Lỗi!" }); }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const [f1, f2] = await Promise.all([
      parser.parseURL(RSS_URLS['Tất cả']).catch(() => ({ items: [] })),
      parser.parseURL(RSS_URLS['Nổi bật']).catch(() => ({ items: [] }))
    ]);
    const allItems = [...f1.items, ...f2.items];
    const item = allItems.find(i => Buffer.from(i.title).toString('hex').substring(0, 12) === req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy!" });
    res.json({
      id: req.params.id, title: item.title, subtitle: item.contentSnippet, heroImage: extractImage(item.content),
      content: [{ type: "paragraph", text: item.contentSnippet }],
      author: { name: item.creator || "Ban biên tập VnExpress", avatar: "/VnExpress-logo-1.png" },
      created_at: item.isoDate
    });
  } catch (error) { res.status(500).json({ message: "Lỗi chi tiết bài báo Duy nhé!" }); }
});

// --- 6. HỆ THỐNG THÔNG BÁO (POSTGRESQL) ---

app.post("/api/notifications/add", async (req, res) => {
  const { receiver_email, actor_name, type, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notifications (receiver_email, actor_name, type, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [receiver_email, actor_name, type, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi thêm thông báo Duy ơi:", err);
    res.status(500).json({ error: "Server không lưu được thông báo!" });
  }
});

app.get("/api/notifications/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE receiver_email = $1 ORDER BY created_at DESC LIMIT 20",
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
    res.status(500).json({ error: "Lỗi database rồi!" });
  }
});

app.post("/api/notifications/read-all", async (req, res) => {
  const { email } = req.body;
  try {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE receiver_email = $1",
      [email]
    );
    res.json({ message: "Đã dọn sạch chấm đỏ cho Duy!" });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái đọc:", err);
    res.status(500).json({ error: "Không update được trạng thái rồi" });
  }
});

// ✅ API MỚI: Xóa tất cả thông báo của một người Duy nhé
app.delete("/api/notifications/:email", async (req, res) => {
  try {
    await pool.query("DELETE FROM notifications WHERE receiver_email = $1", [req.params.email]);
    res.json({ message: "Đã xóa sạch lịch sử thông báo!" });
  } catch (err) { res.status(500).json({ error: "Lỗi dọn dẹp thông báo!" }); }
});

// --- 7. HỆ THỐNG QUẢN TRỊ & THỐNG KÊ (MỚI) ---

// ✅ API: Lấy thống kê cho Dashboard Admin Duy nhé
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "Đang hoạt động" });
    res.json({ totalUsers, activeUsers });
  } catch (err) { res.status(500).json({ message: "Lỗi lấy thống kê!" }); }
});

// ✅ API: Cập nhật vai trò người dùng (Admin/Subscriber)
app.put('/api/admin/users/:email/role', async (req, res) => {
  const { role } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, { role }, { new: true });
    res.json(updatedUser);
  } catch (err) { res.status(500).json({ message: "Lỗi đổi quyền!" }); }
});

// ✅ API: Xóa vĩnh viễn người dùng Duy nhé
app.delete('/api/admin/users/:email', async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.json({ message: "Đã tiễn người dùng này lên đường!" });
  } catch (err) { res.status(500).json({ message: "Lỗi xóa user!" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Diễn Đàn Press chạy tại port ${PORT}`));