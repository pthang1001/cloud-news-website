-- 1. Tạo bảng Danh mục (Để hiện lên thanh Menu/Navbar)
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL, -- Tên tiếng Việt (vd: Xã hội, Thể thao)
    slug VARCHAR(100) UNIQUE NOT NULL -- Đường dẫn đẹp (vd: xa-hoi)
);

-- 2. Tạo bảng Người dùng (Để quản lý Admin đăng bài)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- 3. Tạo bảng Bài viết (Chứa nội dung tin tức)
CREATE TABLE Articles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary NVARCHAR(500),
    content NVARCHAR(MAX) NOT NULL, -- Lưu nội dung chi tiết bài báo
    image_url VARCHAR(500),         -- Lưu link ảnh bài báo
    category_id INT FOREIGN KEY REFERENCES Categories(id),
    author_id INT FOREIGN KEY REFERENCES Users(id),
    created_at DATETIME DEFAULT GETDATE()
);

-- THÊM DỮ LIỆU MẪU (Để báo cáo đồ án có nội dung luôn)
INSERT INTO Categories (name, slug) VALUES (N'Công Nghệ', 'cong-nghe'), (N'Đời Sống', 'doi-song');
INSERT INTO Users (username, password_hash, role) VALUES ('admin_vi', '123456', 'ADMIN');

INSERT INTO Articles (title, slug, summary, content, category_id, author_id) 
VALUES (N'Triển khai Diễn Đàn Press trên Azure', 'trien-khai-cloud', N'Hướng dẫn đồ án Cloud UTH', N'<h3>Hệ thống đã chạy thành công!</h3><p>Dữ liệu này được lấy trực tiếp từ Azure SQL Database.</p>', 1, 1);