import { useState, useRef } from "react";
import "./ArticleEditor.css";

const ArticleEditor = ({ initialData = null, onSave }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState(initialData?.visibility || "Public");
  const [publishMode, setPublishMode] = useState("immediately");
  const [scheduledDate, setScheduledDate] = useState("");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || null);
  const [seoExcerpt, setSeoExcerpt] = useState(initialData?.seoExcerpt || "");
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | unsaved
  const [publishStatus, setPublishStatus] = useState("idle"); // idle | publishing | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef();
  const editorRef = useRef();

  const categories = [
    "Lối Sống", "Công Nghệ", "Kinh Tế", "Thể Thao",
    "Văn Hóa", "Giáo Dục", "Y Tế", "Du Lịch", "Thế Giới",
  ];

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setSaveStatus("saving");
    setTimeout(() => setSaveStatus("saved"), 1200);
  };

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  const handlePublish = () => {
    // Validation
    if (!title.trim()) {
      setErrorMessage("Tiêu đề bài viết không được để trống");
      setPublishStatus("error");
      setTimeout(() => setPublishStatus("idle"), 3000);
      return;
    }

    if (!editorRef.current?.innerHTML?.trim()) {
      setErrorMessage("Nội dung bài viết không được để trống");
      setPublishStatus("error");
      setTimeout(() => setPublishStatus("idle"), 3000);
      return;
    }

    if (!category) {
      setErrorMessage("Vui lòng chọn danh mục");
      setPublishStatus("error");
      setTimeout(() => setPublishStatus("idle"), 3000);
      return;
    }

    if (publishMode === "scheduled" && !scheduledDate) {
      setErrorMessage("Vui lòng chọn thời gian đăng tải");
      setPublishStatus("error");
      setTimeout(() => setPublishStatus("idle"), 3000);
      return;
    }

    setPublishStatus("publishing");
    setErrorMessage("");

    // Simulate API call
    setTimeout(() => {
      const article = {
        title,
        content: editorRef.current?.innerHTML || "",
        category,
        tags,
        visibility,
        publishMode,
        scheduledDate,
        featuredImage,
        seoExcerpt,
        publishedAt: new Date().toISOString(),
      };
      if (onSave) onSave(article);

      // Save to localStorage for history
      const existing = JSON.parse(localStorage.getItem("articles_history") || "[]");
      existing.unshift({ ...article, id: Date.now() });
      localStorage.setItem("articles_history", JSON.stringify(existing.slice(0, 100)));

      setPublishStatus("success");
      setTimeout(() => {
        setPublishStatus("idle");
        // Reset form
        setTitle("");
        setContent("");
        setCategory("");
        setTags([]);
        setSeoExcerpt("");
        setFeaturedImage(null);
        editorRef.current.innerHTML = "";
      }, 1500);
    }, 800);
  };

  return (
    <div className="article-editor">
      {/* TOP BAR
      <div className="editor-topbar">
        <div className="editor-topbar__left">
          <span className="editor-logo">Diễn Đàn Press</span>
        </div>
        <div className="editor-topbar__tabs">
          <span className="editor-nav-tab active">Editor</span>
          <span className="editor-nav-tab">Preview</span>
          <span className="editor-nav-tab">History</span>
        </div>
        <div className="editor-topbar__right">
          <button className="editor-btn-icon" title="Thông báo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="editor-btn-icon" title="Trợ giúp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </button>
          <button className="editor-btn-publish" onClick={handlePublish}>Đăng Tải</button>
        </div>
      </div> */}

      <div className="editor-body">
        {/* MAIN EDITOR AREA */}
        <div className="editor-main">
          <input
            className="editor-title-input"
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={(e) => { setTitle(e.target.value); triggerAutoSave(); }}
          />

          <div className="editor-meta">
            <div className="editor-author-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <span className="editor-author-name">Admin Press</span>
            <span className="editor-dot">·</span>
            <span className="editor-save-status">
              {saveStatus === "saving" ? "Đang lưu..." : saveStatus === "saved" ? "Đã lưu tự động" : "Chưa lưu"}
            </span>
          </div>

          {/* TOOLBAR */}
          <div className="editor-toolbar">
            <button className="toolbar-btn" onClick={() => execCommand("bold")} title="In đậm"><strong>B</strong></button>
            <button className="toolbar-btn" onClick={() => execCommand("italic")} title="In nghiêng"><em>I</em></button>
            <button className="toolbar-btn" onClick={() => execCommand("formatBlock", "h1")} title="Tiêu đề 1">H1</button>
            <button className="toolbar-btn" onClick={() => execCommand("formatBlock", "h2")} title="Tiêu đề 2">H2</button>
            <div className="toolbar-divider" />
            <button className="toolbar-btn" onClick={() => execCommand("insertUnorderedList")} title="Danh sách">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button className="toolbar-btn" onClick={() => execCommand("formatBlock", "blockquote")} title="Trích dẫn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
            </button>
            <button className="toolbar-btn" onClick={() => {
              const url = prompt("Nhập URL:");
              if (url) execCommand("createLink", url);
            }} title="Link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
            <button className="toolbar-btn" onClick={() => {
              const url = prompt("Nhập URL ảnh:");
              if (url) execCommand("insertImage", url);
            }} title="Ảnh">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
            <div className="toolbar-divider" />
            <button className="toolbar-btn" onClick={() => execCommand("formatBlock", "pre")} title="Mã code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </button>
          </div>

          {/* RICH EDITOR */}
          <div
            ref={editorRef}
            className="editor-content"
            contentEditable
            suppressContentEditableWarning
            onInput={triggerAutoSave}
            data-placeholder="Bắt đầu viết bài của bạn tại đây..."
          />
        </div>

        {/* SIDEBAR */}
        <div className="editor-sidebar">
          {/* CÀI ĐẶT XUẤT BẢN */}
          <div className="sidebar-section">
            <div className="sidebar-section__header">CÀI ĐẶT XUẤT BẢN</div>
            <div className="sidebar-row">
              <span className="sidebar-row__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
              <span className="sidebar-row__label">Hiển thị</span>
              <select
                className="sidebar-row__select"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option>Công khai</option>
                <option>Riêng tư</option>
                <option>Bảo mật mật khẩu</option>
              </select>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </span>
              <span className="sidebar-row__label">Đăng tải</span>
              <select
                className="sidebar-row__select"
                value={publishMode}
                onChange={(e) => setPublishMode(e.target.value)}
              >
                <option value="immediately">Ngay lập tức</option>
                <option value="scheduled">Lên lịch</option>
                <option value="draft">Lưu nháp</option>
              </select>
            </div>
            {publishMode === "scheduled" && (
              <div className="sidebar-schedule">
                <input
                  type="datetime-local"
                  className="sidebar-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* TỔ CHỨC */}
          <div className="sidebar-section">
            <div className="sidebar-section__header">TỔ CHỨC</div>
            <div className="sidebar-field">
              <label className="sidebar-label">Danh mục</label>
              <select
                className="sidebar-select-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="sidebar-field">
              <label className="sidebar-label">Tags</label>
              <div className="sidebar-tags">
                {tags.map((tag) => (
                  <span key={tag} className="sidebar-tag">
                    #{tag}
                    <button className="tag-remove" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
                <input
                  className="sidebar-tag-input"
                  placeholder="Thêm tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>
          </div>

          {/* ẢNH ĐẠI DIỆN */}
          <div className="sidebar-section">
            <div className="sidebar-section__header">ẢNH ĐẠI DIỆN</div>
            <div
              className="sidebar-image-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              {featuredImage ? (
                <img src={featuredImage} alt="Featured" className="sidebar-image-preview" />
              ) : (
                <div className="sidebar-image-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Chọn ảnh đại diện</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </div>
            {featuredImage && (
              <button className="sidebar-btn-outline" onClick={() => setFeaturedImage(null)}>
                Xóa ảnh
              </button>
            )}
          </div>

          {/* TÓM TẮT SEO */}
          <div className="sidebar-section">
            <div className="sidebar-section__header">TÓM TẮT SEO</div>
            <textarea
              className="sidebar-textarea"
              placeholder="Mô tả ngắn cho SEO..."
              value={seoExcerpt}
              onChange={(e) => setSeoExcerpt(e.target.value)}
              maxLength={160}
            />
            <div className="sidebar-char-count">{seoExcerpt.length}/160</div>
          </div>

          {/* PUBLISH SECTION */}
          <div className="sidebar-section">
            {errorMessage && publishStatus === "error" && (
              <div className="publish-error-message">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errorMessage}
              </div>
            )}
            {publishStatus === "success" && (
              <div className="publish-success-message">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Bài viết đã được đăng tải thành công!
              </div>
            )}
            <button 
              className={`sidebar-btn-publish ${
                publishStatus === "publishing" ? "loading" : 
                publishStatus === "success" ? "success" : 
                ""
              }`}
              onClick={handlePublish}
              disabled={publishStatus === "publishing"}
            >
              {publishStatus === "publishing" ? (
                <>
                  <span className="spinner"></span>
                  Đang đăng tải...
                </>
              ) : publishStatus === "success" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Đã đăng tải
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Đăng bài viết
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;