-- =========================================
-- DATABASE: NEWS WEBSITE (AZURE SQL)
-- =========================================

-- ========= CREATE TABLES =========
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50),
    email NVARCHAR(100),
    password NVARCHAR(255),
    role NVARCHAR(20),
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    description NVARCHAR(255)
);

CREATE TABLE Articles (
    article_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255),
    content NVARCHAR(MAX),
    image_url NVARCHAR(255),
    category_id INT,
    author_id INT,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (author_id) REFERENCES Users(user_id)
);

CREATE TABLE Comments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    article_id INT,
    user_id INT,
    content NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tags (
    tag_id INT IDENTITY(1,1) PRIMARY KEY,
    tag_name NVARCHAR(50)
);

CREATE TABLE Article_Tags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY(article_id, tag_id),

    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);

-- ========= SAMPLE DATA =========
INSERT INTO Categories (name, description)
VALUES
('Technology','Tin công nghệ'),
('Sports','Tin thể thao'),
('World','Tin thế giới');

INSERT INTO Users (username,email,password,role)
VALUES
('admin','admin@gmail.com','123456','admin'),
('user1','user1@gmail.com','123456','user');

INSERT INTO Articles (title,content,category_id,author_id)
VALUES
('AI đang thay đổi thế giới','Nội dung AI...',1,1),
('World Cup 2026','Tin thể thao...',2,1);

INSERT INTO Comments (article_id,user_id,content)
VALUES
(1,2,'Hay quá'),
(2,2,'Rất thú vị');

INSERT INTO Tags (tag_name)
VALUES
('AI'),
('Cloud'),
('Football');

INSERT INTO Article_Tags (article_id,tag_id)
VALUES
(1,1),
(1,2),
(2,3);

-- ========= TEST QUERIES =========
SELECT * FROM Users;
SELECT * FROM Categories;
SELECT * FROM Articles;
SELECT * FROM Comments;
SELECT * FROM Tags;
SELECT * FROM Article_Tags;

-- ========= JOIN QUERIES =========
-- Lấy bài viết + danh mục
SELECT a.title, c.name
FROM Articles a
JOIN Categories c ON a.category_id = c.category_id;

-- Lấy comment + user
SELECT u.username, c.content
FROM Comments c
JOIN Users u ON c.user_id = u.user_id;

-- ========= FILTER =========
SELECT * FROM Articles
WHERE category_id = 1;
