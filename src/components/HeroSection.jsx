import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../config/api";
import LazyImage from "./LazyImage";

const styles = `
  .hero-section {
    height: 80vh; min-height: 500px;
    position: relative; overflow: hidden;
    margin-bottom: 70px;
  }
  .hero-slider { width: 100%; height: 100%; position: relative; }
  .hero-slide {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 1.5s ease; z-index: 1;
  }
  .hero-image { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; position: absolute; top: 0; left: 0; z-index: -1; }
  .hero-slide.active { opacity: 1; z-index: 2; }
  .hero-content { max-width: 800px; padding: 0 20px; position: relative; z-index: 3; text-align: center; color: white; }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-title    { font-size: 2.1rem; font-weight: 700; margin-bottom: 20px; animation: fadeInUp 1s ease; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
  .hero-subtitle { font-size: 0.95rem; margin-bottom: 30px; animation: fadeInUp 1s ease 0.2s; animation-fill-mode: both; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }
  .hero-buttons  { display: flex; gap: 15px; justify-content: center; animation: fadeInUp 1s ease 0.4s; animation-fill-mode: both; position: absolute; bottom: 100px; left: 0; right: 0; z-index: 10; }
  .btn           { display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px; border-radius: 4px; font-weight: 500; text-align: center; position: relative; overflow: hidden; z-index: 1; transition: all 0.3s ease; }
  .btn-primary   { background-color: #f37121; color: white; border: none; }
  .btn-primary:hover  { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14,165,233,0.3); }
  .btn-contact   { background-color: transparent; color: white; border: 2px solid white; }
  .btn-contact:hover  { background-color: #f37121; color: white; border-color: #f37121; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14,165,233,0.3); }
  @media (max-width: 1200px) { .hero-title { font-size: 1.9rem; } .hero-subtitle { font-size: 0.9rem; } }
  @media (max-width: 992px)  { .hero-section { height: 70vh; margin-bottom: 60px; } .hero-title { font-size: 1.7rem; margin-bottom: 15px; } .hero-subtitle { font-size: 0.85rem; margin-bottom: 25px; } .hero-buttons { bottom: 80px; } }
  @media (max-width: 768px)  { .hero-section { height: 60vh; margin-bottom: 50px; } .hero-title { font-size: 1.5rem; margin-bottom: 15px; } .hero-subtitle { font-size: 0.8rem; margin-bottom: 20px; } .hero-buttons { flex-direction: row; gap: 10px; bottom: 60px; } .btn { padding: 6px 12px; font-size: 0.75rem; white-space: nowrap; height: 34px; gap: 6px; } .btn i { font-size: 0.8rem; } }
  @media (max-width: 576px)  { .hero-section { height: 50vh; min-height: 350px; margin-bottom: 40px; } .hero-title { font-size: 1.3rem; margin-bottom: 10px; } .hero-subtitle { font-size: 0.75rem; margin-bottom: 15px; } .hero-buttons { bottom: 50px; gap: 8px; } .btn { padding: 5px 10px; font-size: 0.7rem; white-space: nowrap; height: 30px; gap: 4px; } .btn i { font-size: 0.75rem; } }
  @media (max-width: 375px)  { .hero-section { height: 45vh; min-height: 300px; } .hero-title { font-size: 1.1rem; } .hero-subtitle { font-size: 0.7rem; } .btn { padding: 4px 8px; font-size: 0.65rem; white-space: nowrap; height: 26px; gap: 3px; } .btn i { font-size: 0.7rem; } }
`

function HeroSection({ settings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const defaultSlides = [
    { image: "/assets/hero/hero-background-1.webp", title: "Best Travel Packages in India - Domestic & International Tours", subtitle: "Discover incredible India with our premium holiday packages. Goa beaches, Kerala backwaters, Himachal mountains - all at unbeatable prices" },
    { image: "/assets/hero/hero-background-2.webp", title: "International Holiday Packages - Bali, Thailand, Vietnam Tours", subtitle: "Explore exotic destinations with our affordable international tour packages. Bali temples, Thailand beaches, Vietnam culture - book now!" },
    { image: "/assets/hero/hero-background-3.webp", title: "Family Vacation & Honeymoon Packages - Create Lasting Memories", subtitle: "Perfect family holidays and romantic honeymoon packages tailored for you. Adventure tours, cultural trips, beach vacations - all inclusive deals" },
  ];

  let slides = defaultSlides;
  if (settings?.homeHeroSlides) {
    try {
      let parsed = settings.homeHeroSlides;
      if (typeof parsed === 'string') {
        let decodedStr = parsed;
        while (decodedStr.includes('&amp;')) decodedStr = decodedStr.replace(/&amp;/g, '&');
        parsed = decodedStr.replace(/&quot;/g, '"').replace(/&#x2F;/ig, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
        try { parsed = JSON.parse(parsed); } catch (e) {
          try { /* eslint-disable-next-line no-eval */ parsed = eval('(' + parsed + ')'); } catch (e2) {}
        }
      }
      if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
      if (Array.isArray(parsed) && parsed.length > 0) { slides = parsed; }
    } catch (e) { console.error("Error in hero slides logic:", e); }
  }

  useEffect(() => {
    if (settings === null) return;
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => { setIsTransitioning(false); }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length, settings]);

  if (settings === null) {
    return (
      <section className="hero-section hero-loading" style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#e0a96d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""} ${index === prevSlide && isTransitioning ? "prev" : ""}`}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 0 }}></div>
            {index === 0 ? (
              <img
                src={getImageUrl(slide.image)}
                alt={slide.title}
                className="hero-image"
                loading="eager"
                fetchpriority="high"
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: -1 }}
              />
            ) : (
              <LazyImage src={getImageUrl(slide.image) || "/placeholder.svg"} alt={slide.title} className="hero-image" />
            )}
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="hero-buttons">
          <Link to="/packages" className="btn btn-primary">
            <i className="fas fa-box"></i>
            <span>View Packages</span>
          </Link>
          <Link to="/contact" className="btn btn-contact">
            <i className="fas fa-envelope"></i>
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;