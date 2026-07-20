import React, { useState } from "react";
import { getImageUrl } from "../config/api";
import AnimatedElement from "./AnimatedElement";

const galleryImages = [
  "/assets/packages/Bali1.webp",
  "/assets/packages/Dubai1.webp",
  "/assets/packages/Goa1.webp",
  "/assets/packages/Thailand1.webp",
  "/assets/packages/Singapore1.webp",
  "/assets/packages/Vietnam1.webp"
];

const styles = `
  .happy-customers {
    padding: 100px 0;
    background-color: #fcfcfc;
    background-image:
      linear-gradient(135deg, rgba(252,252,252,0.95) 0%, rgba(252,252,252,0.85) 100%),
      url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
    overflow: hidden;
  }
  .memory-board-container { margin-top: 30px; display: flex; justify-content: center; }
  .memory-board { position: relative; width: 100%; max-width: 940px; height: 550px; perspective: 1000px; }
  @keyframes floatBob {
    0%   { transform: translateY(0px);   }
    50%  { transform: translateY(-15px); }
    100% { transform: translateY(0px);   }
  }
  .polaroid-wrapper { position: absolute; z-index: 1; }
  .polaroid-wrapper:has(.polaroid-card:hover) { z-index: 20; }
  .polaroid-pos-1 { top: 5%;  left: 8%;   animation: floatBob 6s   ease-in-out infinite; animation-delay: 0s;   }
  .polaroid-pos-2 { top: 12%; left: 38%;  animation: floatBob 7.5s ease-in-out infinite; animation-delay: 1s;   z-index: 2; }
  .polaroid-pos-3 { top: 0%;  right: 10%; animation: floatBob 5.5s ease-in-out infinite; animation-delay: 2.5s; }
  .polaroid-pos-4 { bottom: 5%;  left: 12%;  animation: floatBob 8s   ease-in-out infinite; animation-delay: 0.5s; }
  .polaroid-pos-5 { bottom: -5%; left: 42%;  animation: floatBob 6.5s ease-in-out infinite; animation-delay: 1.5s; z-index: 3; }
  .polaroid-pos-6 { bottom: 10%; right: 15%; animation: floatBob 7s   ease-in-out infinite; animation-delay: 2s;   }
  .polaroid-card {
    position: relative;
    background: #fcfbf7;
    padding: 15px 15px 55px 15px;
    border-radius: 4px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
    transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.4s ease;
    cursor: pointer; z-index: 1;
  }
  .polaroid-pos-1 .polaroid-card { transform: rotate(-8deg);  }
  .polaroid-pos-2 .polaroid-card { transform: rotate(12deg);  }
  .polaroid-pos-3 .polaroid-card { transform: rotate(-5deg);  }
  .polaroid-pos-4 .polaroid-card { transform: rotate(15deg);  }
  .polaroid-pos-5 .polaroid-card { transform: rotate(-10deg); }
  .polaroid-pos-6 .polaroid-card { transform: rotate(7deg);   }
  .polaroid-pos-1 .polaroid-card:hover { transform: scale(1.1) translate(-15px,-15px) rotate(0deg) !important; box-shadow: 15px 15px 40px rgba(0,0,0,0.25); }
  .polaroid-pos-2 .polaroid-card:hover { transform: scale(1.1) translate(0px,-20px) rotate(0deg) !important;   box-shadow: 0px 20px 40px rgba(0,0,0,0.25); }
  .polaroid-pos-3 .polaroid-card:hover { transform: scale(1.1) translate(15px,-15px) rotate(0deg) !important;  box-shadow: -15px 15px 40px rgba(0,0,0,0.25); }
  .polaroid-pos-4 .polaroid-card:hover { transform: scale(1.1) translate(-15px,15px) rotate(0deg) !important;  box-shadow: 15px -15px 40px rgba(0,0,0,0.25); }
  .polaroid-pos-5 .polaroid-card:hover { transform: scale(1.1) translate(0px,20px) rotate(0deg) !important;    box-shadow: 0px -20px 40px rgba(0,0,0,0.25); }
  .polaroid-pos-6 .polaroid-card:hover { transform: scale(1.1) translate(15px,15px) rotate(0deg) !important;   box-shadow: -15px -15px 40px rgba(0,0,0,0.25); }
  .polaroid-card::before {
    content: ''; position: absolute; top: -12px; left: 50%;
    transform: translateX(-50%) rotate(-4deg);
    width: 90px; height: 30px;
    background-color: rgba(245,245,235,0.9);
    box-shadow: 0 1px 3px rgba(0,0,0,0.15); z-index: 5;
    border-radius: 2px;
    border-left: 2px solid rgba(255,255,255,0.8);
    border-right: 2px solid rgba(255,255,255,0.8);
  }
  .polaroid-image-wrapper { position: relative; width: 260px; height: 260px; overflow: hidden; background: #222; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
  .polaroid-image-wrapper img { width: 100%; height: 100%; object-fit: cover; filter: contrast(1.1) saturate(1.1); }
  .polaroid-caption { position: absolute; bottom: 12px; left: 0; width: 100%; text-align: center; font-family: 'Brush Script MT', cursive; font-size: 1.6rem; color: #2d3748; opacity: 0.9; letter-spacing: 1px; }
  .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.45); backdrop-filter: blur(25px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; animation: fadeIn 0.4s ease forwards; cursor: pointer; }
  .lightbox-overlay.closing { animation: fadeOut 0.4s ease forwards; }
  @keyframes fadeIn  { to   { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  .lightbox-polaroid-container { position: relative; transform: scale(0.8); opacity: 0; animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.1s forwards; cursor: default; }
  .lightbox-polaroid-container.closing { animation: popOut 0.4s cubic-bezier(0.36,0,0.66,-0.56) forwards; }
  @keyframes popIn  { to   { transform: scale(1); opacity: 1; } }
  @keyframes popOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.8); opacity: 0; } }
  .lightbox-polaroid { position: relative; background: #fcfbf7; padding: 25px 25px 80px 25px; border-radius: 6px; box-shadow: 0 40px 100px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3); transform: rotate(1deg); }
  .lightbox-polaroid::before { content: ''; position: absolute; top: -20px; left: 50%; transform: translateX(-50%) rotate(-3deg); width: 140px; height: 45px; background-color: rgba(245,245,235,0.95); box-shadow: 0 3px 10px rgba(0,0,0,0.2); z-index: 5; border-radius: 2px; border-left: 2px solid rgba(255,255,255,0.8); border-right: 2px solid rgba(255,255,255,0.8); }
  .lightbox-polaroid .polaroid-image-wrapper { width: 450px; height: 450px; box-shadow: inset 0 0 15px rgba(0,0,0,0.6); }
  .lightbox-polaroid .polaroid-caption { font-size: 2.8rem; bottom: 20px; }
  .lightbox-close { position: absolute; top: -20px; right: -50px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4); color: white; font-size: 1.5rem; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); }
  .lightbox-close:hover { background: rgba(255,255,255,0.9); color: #000; transform: rotate(90deg) scale(1.1); }
  @media (max-width: 992px) {
    .memory-board { height: auto; display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 40px; padding: 20px; }
    .polaroid-wrapper { position: relative; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; margin: 0; display: flex; justify-content: center; width: 100%; }
    @keyframes floatBobMobile { 0% { transform: translateY(0px); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0px); } }
    .polaroid-pos-1,.polaroid-pos-2,.polaroid-pos-3,.polaroid-pos-4,.polaroid-pos-5,.polaroid-pos-6 { animation-name: floatBobMobile; }
    .polaroid-pos-1 .polaroid-card,.polaroid-pos-2 .polaroid-card,.polaroid-pos-3 .polaroid-card,.polaroid-pos-4 .polaroid-card,.polaroid-pos-5 .polaroid-card,.polaroid-pos-6 .polaroid-card { transform: rotate(0deg) !important; width: 100%; max-width: 320px; }
    .polaroid-pos-1 .polaroid-card:hover,.polaroid-pos-2 .polaroid-card:hover,.polaroid-pos-3 .polaroid-card:hover,.polaroid-pos-4 .polaroid-card:hover,.polaroid-pos-5 .polaroid-card:hover,.polaroid-pos-6 .polaroid-card:hover { transform: translateY(-10px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
    .polaroid-image-wrapper { width: 100%; height: auto; aspect-ratio: 1 / 1; }
  }
  @media (max-width: 768px) {
    .memory-board { grid-template-columns: repeat(2,1fr); gap: 20px; padding: 10px; }
    .polaroid-card { padding: 12px 12px 45px 12px; }
    .polaroid-caption { font-size: 1.3rem; bottom: 10px; }
    .lightbox-polaroid .polaroid-image-wrapper { width: 300px; height: 300px; }
    .lightbox-close { right: -10px; top: -50px; }
  }
  @media (max-width: 576px) {
    .happy-customers { padding: 60px 0; }
    .memory-board { grid-template-columns: 1fr; gap: 30px; padding: 10px 15px; }
    .lightbox-polaroid .polaroid-image-wrapper { width: 260px; height: 260px; }
    .lightbox-polaroid { padding: 15px 15px 60px 15px; }
    .lightbox-polaroid .polaroid-caption { font-size: 2rem; bottom: 15px; }
  }
`

const HappyCustomers = ({ settings }) => {
  let displayImages = galleryImages;
  if (settings?.homeHappyCustomersImages) {
    try {
      let parsed = settings.homeHappyCustomersImages;
      if (typeof parsed === 'string') {
        while (parsed.includes('&amp;')) parsed = parsed.replace(/&amp;/g, '&');
        parsed = parsed.replace(/&quot;/g, '"').replace(/&#x2F;/ig, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
        try { parsed = JSON.parse(parsed); } catch (e) {
          try { /* eslint-disable-next-line no-eval */ parsed = eval('(' + parsed + ')'); } catch (e2) {}
        }
      }
      if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
      if (Array.isArray(parsed) && parsed.length > 0) { displayImages = parsed.map(img => img.url || img); }
    } catch (e) { console.error("Error parsing happy customers images:", e); }
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => { setSelectedImage(null); setIsClosing(false); }, 400);
  };

  return (
    <section className="happy-customers section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header text-center">
            <h2 className="section-title">{settings?.homeHappyCustomersTitle || "Our Happy Customers"}</h2>
            <p className="section-subtitle">{settings?.homeHappyCustomersSubtitle || "Glimpses of unforgettable memories created with Pratham Tours"}</p>
          </div>
        </AnimatedElement>

        <div className="memory-board-container">
          <div className="memory-board">
            {displayImages.map((img, index) => (
              <div key={index} className={`polaroid-wrapper polaroid-pos-${index + 1}`}>
                <div className="polaroid-card" onClick={() => setSelectedImage(img)}>
                  <div className="polaroid-image-wrapper">
                    <img src={getImageUrl(img)} alt={`Happy Customer ${index + 1}`} loading="lazy" />
                  </div>
                  <div className="polaroid-caption">#PrathamMemories</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className={`lightbox-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
          <div className={`lightbox-polaroid-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-polaroid">
              <div className="polaroid-image-wrapper">
                <img src={getImageUrl(selectedImage)} alt="Enlarged Memory" />
              </div>
              <div className="polaroid-caption">#PrathamMemories</div>
            </div>
            <button className="lightbox-close" onClick={handleClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HappyCustomers;
