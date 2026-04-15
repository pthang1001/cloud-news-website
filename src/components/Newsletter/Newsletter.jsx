import { useState } from "react";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <div className="newsletter__text">
          <h2 className="newsletter__heading">Theo dõi bản tin hàng ngày</h2>
          <p className="newsletter__desc">
            Đừng bỏ lỡ những thông tin quan trọng được biên soạn bởi đội ngũ chuyên gia của chúng tôi.
          </p>
        </div>
        {submitted ? (
          <div className="newsletter__success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Cảm ơn bạn đã đăng ký!
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter__input"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter__btn">
              Đăng ký ngay
            </button>
          </form>
        )}
      </div>
    </section>
  );
}