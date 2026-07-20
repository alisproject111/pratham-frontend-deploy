import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomizePackageModal from "./CustomizePackageModal";

const styles = `
  .customize-pkg-button { position: fixed; right: 30px; bottom: 100px; width: 55px; height: 55px; border-radius: 50%; background-color: #f37121; color: white; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; transition: all 0.3s ease; opacity: 1; }
  .customize-pkg-button::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.2); border-radius: 50%; transform: scale(0); transition: transform 0.5s ease; }
  .customize-pkg-button:hover { transform: scale(1.1); background-color: #e85d0a; box-shadow: 0 8px 25px rgba(243,113,33,0.4); }
  .customize-pkg-button:hover::before { transform: scale(1.5); opacity: 0; }
  .customize-pkg-button i { font-size: 1.4rem; transition: transform 0.3s ease; position: relative; z-index: 2; }
  @keyframes pkg-btn-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
  .customize-pkg-button:hover i { animation: pkg-btn-pulse 1s infinite; }
  .pkg-tooltip { position: absolute; right: 60px; top: 50%; transform: translateY(-50%); background-color: rgba(0,0,0,0.85); color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 500; letter-spacing: 0.3px; white-space: nowrap; pointer-events: none; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15); opacity: 0; animation: tooltip-fade-in 0.2s ease forwards; }
  .pkg-tooltip:after { content: ""; position: absolute; top: 50%; right: -10px; margin-top: -5px; border-width: 5px; border-style: solid; border-color: transparent transparent transparent rgba(0,0,0,0.85); }
  @keyframes tooltip-fade-in { from { opacity: 0; right: 55px; } to { opacity: 1; right: 60px; } }
  @media (max-width: 768px) { .customize-pkg-button { width: 50px; height: 50px; right: 20px; bottom: 90px; } .customize-pkg-button i { font-size: 1.2rem; } .pkg-tooltip { right: 55px; } }
  @media (max-width: 576px) { .customize-pkg-button { width: 45px; height: 45px; right: 15px; bottom: 80px; } .customize-pkg-button i { font-size: 1.1rem; } .pkg-tooltip { display: none; } }
`

function CustomizePackageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  // Only show on home page and packages page
  const isAllowedPage =
    location.pathname === "/" || location.pathname === "/packages";

  // Show button after scrolling down a bit
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300 && isAllowedPage) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllowedPage]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  if (!isAllowedPage) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {isVisible && (
        <button
          className="customize-pkg-button"
          onClick={openModal}
          aria-label="Customize Package"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <i className="fas fa-wand-magic-sparkles"></i>
          {showTooltip && (
            <div className="pkg-tooltip">Design your perfect trip</div>
          )}
        </button>
      )}

      {isModalOpen && <CustomizePackageModal onClose={closeModal} />}
    </>
  );
}

export default CustomizePackageButton;
