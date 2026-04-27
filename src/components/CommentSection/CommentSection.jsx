import { useState, useEffect } from "react";
// ✅ Import hook thông báo Duy mới tạo nhé
import { useNotifications } from "../../contexts/NotificationContext"; 
import "./CommentSection.css";

export default function CommentSection({ comments = [], onCommentSubmit, fetchComments }) {
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // ✅ Biến để fix lỗi hiện sai tên Đào Văn Hoàng
  const [tagUser, setTagUser] = useState(""); 
  const [targetEmail, setTargetEmail] = useState(""); 

  const { fetchNotifications } = useNotifications();
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(' ');
    return parts.map(w => w[0]).slice(-2).join('').toUpperCase();
  };

  // 🚀 HÀM BẮN THÔNG BÁO THỰC LÊN SERVER
  const pushNotification = async (receiverEmail, type, content) => {
    if (!receiverEmail || receiverEmail === currentUser.email) return;
    try {
      await fetch(`http://localhost:5000/api/notifications/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_email: receiverEmail,
          actor_name: currentUser.fullname || "Người dùng", 
          type: type, 
          content: content
        })
      });
      if (fetchNotifications) fetchNotifications(); 
    } catch (err) {
      console.error("Lỗi bắn noti:", err);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    if (onCommentSubmit) {
      await onCommentSubmit(text);
      setText("");
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim()) return;
    
    // 🚀 GẮN TAG TÍM VÀO ĐẦU BÌNH LUẬN DUY NHÉ
    const textToSubmit = tagUser ? `@[${tagUser}] ${replyText}` : replyText;

    try {
      if (onCommentSubmit) {
        await onCommentSubmit(textToSubmit, parentId);
        
        // 🚀 Bắn thông báo cho đúng người được rep
        await pushNotification(targetEmail, 'reply', 'đã trả lời bình luận của bạn');

        setReplyText("");
        setReplyingTo(null);
        setTagUser("");
        setTargetEmail("");
      }
    } catch (err) {
      console.error("Lỗi gửi rep Duy ơi:", err);
    }
  };

  const handleAction = async (action, commentId, authorEmail) => {
    setActiveMenuId(null);

    // ✅ GIỮ NGUYÊN CHỨC NĂNG XÓA CỦA DUY
    if (action === 'delete') {
      if (!window.confirm("Duy chắc chắn muốn xóa bình luận này chứ?")) return;
      setLocalComments(prev => prev.filter(c => c.id !== commentId));
    }

    try {
      let url = `http://localhost:5000/api/articles/comments/${commentId}`;
      let options = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' } 
      };

      if (action === 'delete') {
        options.method = 'DELETE';
      } else if (action === 'like') {
        url = `${url}/like`;
        options.body = JSON.stringify({ userEmail: currentUser.email });
      } else if (action === 'report') {
        url = `${url}/report`;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (res.ok) {
        if (action === 'like') {
          // 🚀 Bắn thông báo Like Duy nhé
          await pushNotification(authorEmail, 'like', 'đã thích bình luận của bạn');

          if (data.likes !== undefined) {
            setLocalComments(prev => prev.map(c => 
              c.id === commentId ? { ...c, likes: data.likes } : c
            ));
          }
        }
        if (fetchComments) fetchComments();
      }
    } catch (err) {
      console.error(`Lỗi ${action}:`, err);
      if (fetchComments) fetchComments();
    }
  };

  const rootComments = localComments.filter(c => !c.parent_id);

  return (
    <div className="cs-wrap">
      <h2 className="cs-heading">Bình luận <span className="cs-count">({localComments.length})</span></h2>

      <div className="cs-compose">
        <textarea
          className="cs-input"
          placeholder="Chia sẻ ý kiến của bạn..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="cs-compose-footer">
          <button className="cs-submit" onClick={handleSubmit}>Gửi bình luận</button>
        </div>
      </div>

      <div className="cs-list">
        {rootComments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Chưa có bình luận nào.</p>
        ) : (
          rootComments.map((c) => (
            <div key={c.id} className="cs-item-group">
              <CommentItem 
                comment={c} 
                currentUser={currentUser}
                onReply={() => {
                    setReplyingTo(c.id);
                    setTagUser(""); 
                    setTargetEmail(c.user_email);
                }}
                onLike={() => handleAction('like', c.id, c.user_email)}
                onReport={() => handleAction('report', c.id)}
                onDelete={() => handleAction('delete', c.id)}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                getInitials={getInitials}
              />

              {replyingTo === c.id && (
                <div className="cs-reply-compose" style={{ marginLeft: '50px', marginTop: '10px' }}>
                  <textarea 
                    className="cs-input" 
                    placeholder={`Trả lời ${tagUser || c.user_name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    autoFocus
                  />
                  <div className="cs-compose-footer">
                    <button className="cs-cancel" onClick={() => { setReplyingTo(null); setTagUser(""); }}>Hủy</button>
                    <button className="cs-submit" onClick={() => handleReplySubmit(c.id)}>Trả lời</button>
                  </div>
                </div>
              )}

              <div className="cs-replies" style={{ marginLeft: '50px' }}>
                {localComments.filter(reply => reply.parent_id === c.id).map(reply => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    isReply={true}
                    currentUser={currentUser}
                    onReply={() => {
                        setReplyingTo(c.id); 
                        setTagUser(reply.user_name); 
                        setTargetEmail(reply.user_email);
                    }}
                    onLike={() => handleAction('like', reply.id, reply.user_email)}
                    onReport={() => handleAction('report', reply.id)}
                    onDelete={() => handleAction('delete', reply.id)}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    getInitials={getInitials}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, currentUser, onReply, onLike, onReport, onDelete, activeMenuId, setActiveMenuId, getInitials, isReply }) {
  const isOwner = currentUser.email === comment.user_email;

  // 🚀 Logic Tag tím (Sửa Regex của Duy cho chuẩn)
  const tagMatch = (comment.content || "").match(/^@\[([^\]]+)\]/);
  const tagNameOnly = tagMatch ? tagMatch[1] : null;
  const cleanContent = tagMatch ? comment.content.substring(tagMatch[0].length) : comment.content;

  return (
    <div className={`cs-item ${isReply ? 'cs-item--reply' : ''}`}>
      {comment.user_avatar ? (
        <img src={comment.user_avatar} alt="AVT" className="cs-avatar" />
      ) : (
        <div className="cs-avatar" style={{ background: '#7c3aed' }}>{getInitials(comment.user_name)}</div>
      )}

      <div className="cs-content">
        <div className="cs-top">
          <div className="cs-author-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="cs-author" style={{ fontWeight: 'bold' }}>{comment.user_name}</span>
          </div>
          <span className="cs-time">{new Date(comment.created_at).toLocaleString('vi-VN')}</span>
          
          <div className="cs-more-wrap">
            <button className="cs-more-btn" onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            {activeMenuId === comment.id && (
              <div className="cs-dropdown">
                {isOwner ? (
                  <button className="cs-drop-item delete" onClick={onDelete}>Xóa bình luận</button>
                ) : (
                  <button className="cs-drop-item" onClick={onReport}>Tố cáo vi phạm</button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <p className="cs-text">
            {tagNameOnly && (
                <span className="cs-reply-label" style={{ fontSize: '13px', color: '#7c3aed', fontWeight: 'bold', marginRight: '8px' }}>
                    ↳ @{tagNameOnly}
                </span>
            )}
            {cleanContent}
        </p>
        
        <div className="cs-actions">
          <button 
            className="cs-like" 
            onClick={onLike}
            style={{ color: (parseInt(comment.likes) || 0) > 0 ? '#7c3aed' : '#64748b', fontWeight: (parseInt(comment.likes) || 0) > 0 ? 'bold' : 'normal' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={(parseInt(comment.likes) || 0) > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            Thích {(parseInt(comment.likes) || 0) > 0 && <span>{comment.likes}</span>}
          </button>
          
          <button className="cs-reply" onClick={onReply}>Trả lời</button>
        </div>
      </div>
    </div>
  );
}