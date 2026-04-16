import { useState } from "react";
import ArticleEditor from "./ArticleEditor";
import ArticlesList from "./ArticlesList";
import ArticlesHistory from "./ArticlesHistory";
import "./ArticlesPage.css";

const ArticlesPage = () => {
  const [activeTab, setActiveTab] = useState("editor");

  const tabs = [
    { id: "editor", label: "Đăng Tải" },
    { id: "list", label: "Tất Cả Bài Viết" },
    { id: "history", label: "Lịch Sử" },
  ];

  return (
    <div className="articles-page">
      <div className="articles-page__header">
        <div className="articles-page__title-block">
          <h1 className="articles-page__title">Quản Lý Bài Viết</h1>
          <p className="articles-page__subtitle">Diễn Đàn Press · Bộ Công Cụ Biên Tập</p>
        </div>
        <div className="articles-page__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`articles-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && <span className="tab-indicator" />}
            </button>
          ))}
        </div>
      </div>

      <div className="articles-page__content">
        {activeTab === "editor" && <ArticleEditor />}
        {activeTab === "list" && <ArticlesList />}
        {activeTab === "history" && <ArticlesHistory />}
      </div>
    </div>
  );
};

export default ArticlesPage;