import "./ArticleAuthor.css";

export default function ArticleAuthor({ author }) {
  if (!author) return null;
  return (
    <div className="aa-card">
      <img src={author.avatar} alt={author.name} className="aa-avatar" />
      <div className="aa-info">
        <p className="aa-label">Tác giả bài viết</p>
        <p className="aa-name">{author.name}</p>
        <p className="aa-bio">{author.bio}</p>
      </div>
    </div>
  );
}