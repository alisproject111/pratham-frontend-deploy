import React from "react";
import { getImageUrl } from "../config/api";
import AnimatedElement from "./AnimatedElement";

const packageOffers = [
  { id: 1, days: "7 Days",  title: "Highlights of Europe", price: "₹1,59,000", active: true  },
  { id: 2, days: "9 Days",  title: "Best of Europe",        price: "₹1,98,000", active: false },
  { id: 3, days: "14 Days", title: "All of Europe",         price: "₹3,25,000", active: false }
];

const styles = `
  .offers-section {
    padding: 60px 0;
    background-color: #fff;
  }
  .offers-section .container {
    max-width: 1440px;
  }
  .special-banner-wrapper {
    display: flex;
    background-color: #fffaf5;
    border-radius: 12px;
    border: 1px solid #f3e5d8;
    overflow: hidden;
    position: relative;
    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
    min-height: 260px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .special-banner-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 45px rgba(0,0,0,0.1);
  }
  .special-banner-wrapper::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: radial-gradient(#e6d5c3 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }
  .special-banner-content {
    flex: 0 0 58%;
    padding: 20px 30px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .banner-heading { margin-bottom: 15px; }
  .banner-heading h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 6px;
    font-weight: 500;
  }
  .text-red  { color: #b22222; }
  .italic    { font-style: italic; font-weight: 700; }
  .banner-heading p { font-size: 1.05rem; color: #555; margin: 0; }
  .underline-red {
    font-weight: 700;
    border-bottom: 2px solid #b22222;
    padding-bottom: 2px;
    color: #333;
  }
  .banner-cards-scroll {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #f3e5d8 transparent;
  }
  .banner-cards-scroll::-webkit-scrollbar { height: 6px; }
  .banner-cards-scroll::-webkit-scrollbar-track { background: transparent; }
  .banner-cards-scroll::-webkit-scrollbar-thumb { background-color: #f3e5d8; border-radius: 10px; }
  .banner-card {
    flex: 1;
    min-width: 140px;
    max-width: 190px;
    background: #ffffff;
    border: 1px solid #f3e5d8;
    border-radius: 8px;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .banner-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
  .banner-card.active {
    flex: 1.2; max-width: 220px;
    background: #fdf0df;
    border-color: #fdf0df;
    box-shadow: none;
  }
  .card-days    { font-size: 0.8rem;  color: #666; margin-bottom: 6px;  font-weight: 400; }
  .card-title   { font-size: 1rem;    font-weight: 700; color: #333; margin-bottom: 15px; line-height: 1.3; height: 35px; display: flex; align-items: flex-start; }
  .card-starting{ font-size: 0.75rem; color: #777; margin-bottom: 2px;  font-weight: 400; }
  .card-price   { font-size: 1.25rem; font-weight: 800; color: #b22222; margin-bottom: 10px; }
  .card-know-more-btn {
    margin-top: auto;
    background: transparent;
    border: 1.5px solid #b22222;
    color: #b22222;
    padding: 6px 10px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%;
  }
  .card-know-more-btn:hover { background: #b22222; color: white; }
  .card-know-more-btn i { font-size: 0.85rem; transition: transform 0.3s ease; }
  .card-know-more-btn:hover i { transform: translateX(4px); }
  .special-banner-image {
    position: absolute; top: 0; right: 0;
    width: 42%; height: 100%;
    border-top-left-radius: 180px 250px;
    border-bottom-left-radius: 180px 250px;
    border-left: 8px solid #ecd1b8;
    overflow: hidden; z-index: 1;
  }
  .special-banner-image img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  @media (max-width: 1024px) {
    .special-banner-wrapper { flex-direction: column; min-height: auto; }
    .special-banner-content { flex: 0 0 100%; width: 100%; padding: 25px; background: #fffaf5; }
    .special-banner-image { width: 100%; height: 300px; position: relative; border-radius: 0; border-left: none; border-top: 6px solid #ecd1b8; }
  }
  @media (max-width: 768px) {
    .banner-heading h2 { font-size: 1.5rem; }
    .banner-heading p  { font-size: 0.95rem; }
    .banner-cards-scroll { flex-direction: column; overflow-x: hidden; gap: 15px; padding-bottom: 0; }
    .banner-card { min-width: 100%; max-width: 100%; }
    .banner-card.active { min-width: 100%; max-width: 100%; }
    .special-banner-image { height: 250px; }
  }
  @media (max-width: 576px) {
    .special-banner-content { padding: 20px 15px; }
    .banner-heading h2 { font-size: 1.3rem; }
    .banner-heading p  { font-size: 0.85rem; }
    .banner-cards-scroll { gap: 12px; }
    .banner-card { padding: 15px; }
    .card-title  { font-size: 1rem; height: auto; margin-bottom: 10px; }
    .card-price  { font-size: 1.2rem; }
    .special-banner-image { height: 200px; }
  }
`

const OffersSection = ({ settings }) => {
  let offers = packageOffers;
  if (settings?.homeOffers) {
    try {
      let parsed = settings.homeOffers;
      if (typeof parsed === 'string') {
        while (parsed.includes('&amp;')) parsed = parsed.replace(/&amp;/g, '&');
        parsed = parsed.replace(/&quot;/g, '"').replace(/&#x2F;/ig, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {
          try {
            // eslint-disable-next-line no-eval
            parsed = eval('(' + parsed + ')');
          } catch (e2) {}
        }
      }
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch(e) {}
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        offers = parsed;
      }
    } catch (e) {
      console.error("Error parsing offers:", e);
    }
  }

  return (
    <section className="offers-section section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container">
        <div className="section-header">
          <AnimatedElement animation="fade-up">
            <h2 className="section-title">{settings?.homeOffersTitle || "Special Offers"}</h2>
            <p className="section-subtitle">{settings?.homeOffersSubtitle || "Grab our exclusive limited-time deals and make your dream vacation a reality."}</p>
          </AnimatedElement>
        </div>
        <AnimatedElement animation="fade-up">
          <div className="special-banner-wrapper">
            <div className="special-banner-content">
              <div className="banner-heading">
                <h2>
                  {settings?.homeOffersBannerHeading || <><span className="text-red italic">5,000</span> <span className="text-red">Years</span> <strong>Ancient.</strong> <span className="text-red italic">50</span> <span className="text-red">Years</span> <strong>Ahead.</strong></>}
                </h2>
                <p>
                  {settings?.homeOffersBannerSubtext || <>Visit all-inclusive <span className="underline-red">EUROPE</span> tours with Pratham Tours</>}
                </p>
              </div>

              <div className="banner-cards-scroll">
                {offers.map((pkg, idx) => (
                  <div key={pkg.id || idx} className={`banner-card ${pkg.active ? 'active' : ''}`}>
                    <div className="card-days">{pkg.days}</div>
                    <div className="card-title">{pkg.title}</div>
                    <div className="card-starting">Starting from</div>
                    <div className="card-price">{pkg.price}</div>
                    <button className="card-know-more-btn">
                      Know More <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="special-banner-image">
              <img
                src={getImageUrl((settings?.homeOffersBannerImage || "/assets/hero/packages-header.webp").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#x2F;/g, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'"))}
                alt="Europe Tour"
              />
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default OffersSection;
