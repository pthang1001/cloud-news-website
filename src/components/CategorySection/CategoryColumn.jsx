import "./CategorySection.css";

export default function CategoryColumn({ category }) {
  return (
    <div className="cat-col">
      <div className="cat-col__header">
        <h3 className="cat-col__title">
          <span className="cat-col__icon">{category.icon}</span>
          {category.label}
        </h3>
        <span className="cat-col__icon-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </span>
      </div>

      <a href="#" className="cat-col__main-article">
        <div className="cat-col__img-wrap">
          <img
            src={category.mainArticle.image}
            alt={category.mainArticle.title}
            className="cat-col__img"
            loading="lazy"
          />
        </div>
        <p className="cat-col__main-title">{category.mainArticle.title}</p>
      </a>

      <ul className="cat-col__sub-list">
        {category.subArticles.map((title, i) => (
          <li key={i} className="cat-col__sub-item">
            <span className="cat-col__sub-bar" />
            <a href="#" className="cat-col__sub-link">{title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}