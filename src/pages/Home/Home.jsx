import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import BreakingNews from "../../components/BreakingNews/BreakingNews";
import CategorySection from "../../components/CategorySection/CategorySection";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import { getAllArticles, getTopArticles } from "../../services/articleService";
// FIX: Import hook quản lý bài viết đã lưu để dùng cho nút Lịch sử Duy nhé
import { useSavedArticles } from "../../contexts/SavedArticlesContext"; 
import "./Home.css";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [topArticles, setTopArticles] = useState([]); 
  const [category, setCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // FIX: Lấy danh sách ID đã lưu và các hàm xử lý từ Context
  const { savedArticleIds, addSavedArticleId, removeSavedArticleId } = useSavedArticles();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setArticles([]); 

      try {
        const [mainData, topData] = await Promise.all([
          getAllArticles(category, searchQuery),
          getTopArticles()
        ]);
        
        setArticles(mainData);
        setTopArticles(topData);
      } catch (error) {
        console.error("Lỗi tải tin bạn ơi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      const timer = setTimeout(() => {
        fetchData();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      fetchData();
    }
  }, [category, searchQuery]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setSearchQuery(""); 
  };

  return (
    <div className="home-page">
      <Navbar 
        onCategoryChange={handleCategoryChange} 
        onSearch={setSearchQuery} 
        currentCategory={category} 
      />
      
      <main>
        <section className="home-top">
          {/* TIÊU ĐIỂM: Truyền thêm trạng thái đã lưu để hiện icon xanh Duy nhé */}
          <HeroSection 
            featuredArticle={topArticles.length > 0 ? topArticles[0] : null} 
            loading={loading}
            isSaved={topArticles[0] ? savedArticleIds.includes(topArticles[0].id) : false}
            onSave={() => addSavedArticleId(topArticles[0]?.id)}
            onRemove={() => removeSavedArticleId(topArticles[0]?.id)}
          />
          
          {/* TIN NỔI BẬT: Truyền logic lưu cho danh sách tin bên cạnh */}
          <BreakingNews 
            articles={topArticles.slice(1, 5)} 
            loading={loading}
            savedArticleIds={savedArticleIds}
            addSavedArticleId={addSavedArticleId}
            removeSavedArticleId={removeSavedArticleId}
          />
        </section>

        {/* Cột chính: ArticleCard bên trong này cũng sẽ nhận được trạng thái lưu bài */}
        <CategorySection 
          title={
            searchQuery 
              ? `Kết quả cho: "${searchQuery}"` 
              : (category === "Tất cả" ? "Tất cả bài viết" : `Tin tức ${category}`)
          } 
          articles={articles} 
          loading={loading}
          savedArticleIds={savedArticleIds}
          addSavedArticleId={addSavedArticleId}
          removeSavedArticleId={removeSavedArticleId}
        />
        
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}