import heroImg from "../../assets/hero.png";
import "./HeroSection.css";

const HERO_ARTICLE = {
  category: "TIÊU ĐIỂM",
  timeAgo: "10 phút trước",
  title: "Tầm nhìn mới cho phát triển hạ tầng số tại Việt Nam trong thập kỷ 2030",
  excerpt:
    "Các chuyên gia nhận định việc đầu tư vào hệ sinh thái dữ liệu và kết nối thông minh sẽ là chìa khóa để thúc đẩy tăng trưởng GDP quốc gia.",
  author: {
    name: "Lê Hoàng Nam",
    avatar: "https://i.pravatar.cc/32?img=12",
  },
  image: heroImg,
};

export default function HeroSection() {
  return (
    <article className="hero-section">
      <div className="hero__image-wrap">
        <img src={HERO_ARTICLE.image} alt={HERO_ARTICLE.title} className="hero__image" />
      </div>
      <div className="hero__content">
        <div className="hero__meta">
          <span className="hero__badge">{HERO_ARTICLE.category}</span>
          <span className="hero__time">{HERO_ARTICLE.timeAgo}</span>
        </div>
        <h1 className="hero__title">{HERO_ARTICLE.title}</h1>
        <p className="hero__excerpt">{HERO_ARTICLE.excerpt}</p>
        <div className="hero__author">
          <img src={HERO_ARTICLE.author.avatar} alt={HERO_ARTICLE.author.name} className="hero__avatar" />
          <span className="hero__author-name">{HERO_ARTICLE.author.name}</span>
        </div>
      </div>
    </article>
  );
}