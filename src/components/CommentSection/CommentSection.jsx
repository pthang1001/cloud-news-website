import { useState } from "react";
import "./CommentSection.css";

export default function CommentSection({ comments = [] }) {
  const [text, setText] = useState("");
  const [list, setList] = useState(comments);
  const [likedIds, setLikedIds] = useState([]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setList((prev) => [
      {
        id: Date.now(),
        author: "Bạn",
        initials: "B",
        color: "#7c3aed",
        timeAgo: "Vừa xong",
        text: text.trim(),
        likes: 0,
      },
      ...prev,
    ]);
    setText("");
  };

  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="cs-wrap">
      <h2 className="cs-heading">Bình luận <span className="cs-count">({list.length})</span></h2>

      {/* Compose */}
      <div className="cs-compose">
        <textarea
          className="cs-input"
          placeholder="Chia sẻ ý kiến của bạn..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="cs-compose-footer">
          <button className="cs-submit" onClick={handleSubmit}>
            Gửi bình luận
          </button>
        </div>
      </div>

      {/* List */}
      <div className="cs-list">
        {list.map((c) => (
          <div key={c.id} className="cs-item">
            <div
              className="cs-avatar"
              style={{ background: c.color }}
            >
              {c.initials}
            </div>
            <div className="cs-content">
              <div className="cs-top">
                <span className="cs-author">{c.author}</span>
                <span className="cs-time">{c.timeAgo}</span>
              </div>
              <p className="cs-text">{c.text}</p>
              <div className="cs-actions">
                <button
                  className={`cs-like${likedIds.includes(c.id) ? " cs-like--active" : ""}`}
                  onClick={() => handleLike(c.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={likedIds.includes(c.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  Thích {c.likes > 0 && <span>{c.likes}</span>}
                </button>
                <button className="cs-reply">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                  Trả lời
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}