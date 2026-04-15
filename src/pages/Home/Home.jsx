import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import BreakingNews from "../../components/BreakingNews/BreakingNews";
import CategorySection from "../../components/CategorySection/CategorySection";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <section className="home-top">
          <HeroSection />
          <BreakingNews />
        </section>
        <CategorySection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}