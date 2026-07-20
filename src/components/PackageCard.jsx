import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedElement from "./AnimatedElement";

const cardStyles = `
  .package-card { background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1); height: 100%; display: flex; flex-direction: column; margin: 0 auto; width: 100%; cursor: pointer; position: relative; }
  .package-card:hover { transform: translateY(-10px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); border: 0px solid rgba(0, 0, 0, 0.2); }
  .package-image-container { position: relative; height: 180px; overflow: hidden; cursor: pointer; }
  .package-image-container .package-image { width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out; will-change: transform; }
  .package-image-container:hover .package-image { transform: scale(1.1) translateZ(0); }
  .package-duration { position: absolute; bottom: 15px; left: 15px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 5px; }
  .package-duration i { font-size: 0.8rem; }
  .package-featured-star { position: absolute; top: 10px; left: 10px; width: 24px; height: 24px; background: linear-gradient(135deg, #f5a623 0%, #f7c94e 60%, #e8920f 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(245, 166, 35, 0.6); z-index: 10; animation: star-glow 2.5s ease-in-out infinite; }
  .package-featured-star i { font-size: 0.6rem; color: #fff; }
  @keyframes star-glow { 0%, 100% { box-shadow: 0 3px 12px rgba(245, 166, 35, 0.6); } 50% { box-shadow: 0 3px 22px rgba(245, 166, 35, 0.95); } }
  .package-actions { position: absolute; top: 15px; right: 15px; display: flex; flex-direction: column; gap: 10px; z-index: 10; }
  .package-action-btn { background-color: #ffffff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); position: relative; }
  .package-action-btn:hover { background-color: #f37121; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(14, 165, 233, 0.4); }
  .package-action-btn i { font-size: 1rem; color: #414042; transition: all 0.3s ease; }
  .package-action-btn:hover i { color: #ffffff; transform: scale(1.1); }
  .btn-preloader { width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .package-action-btn.checking { background-color: #888; cursor: wait; }
  .package-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
  .package-title1 { font-size: 1.3rem !important; margin-bottom: 8px; color: #414042; transition: color 0.3s ease; font-weight: 700; height: 2.6rem; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; }
  .package-card:hover .package-title1 { color: #f37121; }
  .package-location { display: flex; align-items: center; font-size: 0.9rem; margin-bottom: 12px; gap: 5px; height: 1.2rem; }
  .package-location i { color: #f37121; }
  .package-features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; flex-grow: 1; }
  .feature-row { display: flex; justify-content: space-between; }
  .feature-item { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #555; width: 48%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .feature-item i { color: #f37121; font-size: 0.8rem; min-width: 14px; }
  .package-price-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 12px; border-top: 1px solid #eee; height: 4.5rem; }
  .price-details { display: flex; flex-direction: column; }
  .original-price { color: #999; font-size: 0.9rem; text-decoration: line-through; }
  .current-price { color: #414042; font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
  .price-per { color: #666; font-size: 0.8rem; }
  .read-more-btn { background: linear-gradient(135deg, #f37121 0%, #f99b66 100%); color: white; border: none; padding: 10px 22px; border-radius: 30px; font-size: 0.95rem; font-weight: 600; transition: all 0.3s ease; text-align: center; text-decoration: none; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
  .read-more-btn:hover { background: linear-gradient(135deg, #414042 0%, #f37121 100%); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5); }
  .read-more-btn i { font-size: 0.9rem; transition: transform 0.3s ease; }
  .read-more-btn:hover i { transform: scale(1.1); }
  @media (max-width: 1200px) { .package-image-container { height: 170px; } .package-title1 { font-size: 1.2rem !important; } .current-price { font-size: 1.4rem; } }
  @media (max-width: 992px) { .package-card { max-width: 100%; } .package-image-container { height: 160px; } .package-title1 { font-size: 1.1rem !important; height: 2.2rem; } .current-price { font-size: 1.3rem; } }
  @media (max-width: 768px) { .package-card { margin: 0; max-width: 450px; opacity: 1 !important; display: flex !important; } .package-image-container { height: 200px; } .package-content { padding: 12px; } .package-title1 { font-size: 1.1rem !important; margin-bottom: 5px; } .package-location { font-size: 0.85rem; margin-bottom: 8px; } .feature-row { flex-direction: column; gap: 6px; } .feature-item { width: 100%; font-size: 0.8rem; } .package-price-container { flex-direction: column; gap: 10px; align-items: flex-start; height: auto; padding-top: 8px; } .current-price { font-size: 1.3rem; } .read-more-btn { width: 100%; padding: 8px 12px; font-size: 0.85rem; } }
  @media (max-width: 576px) { .package-card { max-width: 100%; } .package-image-container { height: 180px; } .package-action-btn { width: 32px; height: 32px; } .package-title1 { font-size: 1rem !important; } .current-price { font-size: 1.2rem; } }
  @media (max-width: 375px) { .package-image-container { height: 160px; } .package-title1 { font-size: 0.95rem !important; } .feature-item { font-size: 0.75rem; } .current-price { font-size: 1.1rem; } .read-more-btn { font-size: 0.8rem; } }
`
import Toast from "./Toast";
import LazyImage from "./LazyImage";
import { downloadPDFOnDemand } from "../utils/pdfOptimizaion";
import { generateSlug } from "../utils/slugify";
import { getImageUrl } from "../config/api";

function PackageCard({ package: pkg }) {
  // Decode HTML entities in text fields (e.g. &amp; → &)
  const decodeHtml = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');
  };

  // Resolve image URL
  const resolveImageUrl = (image) => {
    return getImageUrl(image) || '/placeholder.svg';
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isCheckingPdf, setIsCheckingPdf] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const navigate = useNavigate();

  // Handle card click to navigate to details page
  const handleCardClick = useCallback(() => {
    window.scrollTo(0, 0);
    navigate(`/package/${generateSlug(pkg.name)}`);
  }, [navigate, pkg.name]);

  // Format duration as nights/days (e.g., 4N/5D)
  const formatDuration = useCallback((days) => {
    const nights = days - 1;
    return `${nights}N/${days}D`;
  }, []);

  // Memoize original price calculation
  const originalPrice = useMemo(() => {
    return Math.round(pkg.price * (1 + Math.random() * 0.1 + 0.1));
  }, [pkg.price]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  }, []);

  // Handle sharing functionality
  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/package/${generateSlug(pkg.name)}`;

    if (navigator.share) {
      navigator
        .share({
          title: pkg.name,
          text: `Check out this amazing travel package: ${pkg.name}`,
          url: shareUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  }, [pkg.name, copyToClipboard]);

  // Optimized PDF download with on-demand loading
  const handleDownload = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCheckingPdf || isPdfLoading) return;

    setIsCheckingPdf(true);
    setIsPdfLoading(true);

    // Check if the package has a PDF URL
    if (pkg.pdfUrl && pkg.pdfUrl.trim() !== "") {
      const packageFileName = generateSlug(pkg.name);

      try {
        // Load PDF on-demand as a Blob dynamically only when clicked
        await downloadPDFOnDemand(pkg.pdfUrl, `${packageFileName}.pdf`);

        // Show success toast
        setToastMessage("PDF downloaded successfully!");
        setToastType("success");
      } catch (err) {
        console.error("[v0] Error fetching PDF brochure:", err);
        setToastMessage("Failed to download PDF brochure. Please try again.");
        setToastType("error");
      } finally {
        setShowToast(true);
        setIsCheckingPdf(false);
        setIsPdfLoading(false);

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } else {
      // Show error if PDF not available
      setToastMessage("PDF not available for this package");
      setToastType("error");
      setShowToast(true);
      setIsCheckingPdf(false);
      setIsPdfLoading(false);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [pkg.name, pkg.pdfUrl, isCheckingPdf, isPdfLoading]);

  return (
    <AnimatedElement animation="fade-up">
      <style dangerouslySetInnerHTML={{ __html: cardStyles }} />
      <div 
        className="package-card" 
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className="package-image-container">
          <LazyImage
            src={resolveImageUrl(pkg.image)}
            alt={decodeHtml(pkg.name)}
            className="package-image"
            loading="lazy"
            decoding="async"
          />
          {/* Star badge - shown when package is featured */}
          {pkg.featured && (
            <div className="package-featured-star">
              <i className="fas fa-star"></i>
            </div>
          )}
          <div className="package-duration">
            <i className="fas fa-clock"></i> {formatDuration(pkg.duration)}
          </div>
          <div className="package-actions">
            <button
              className={`package-action-btn download-btn ${
                isCheckingPdf || isPdfLoading ? "checking" : ""
              }`}
              onClick={handleDownload}
              aria-label="Download PDF"
              disabled={isCheckingPdf || isPdfLoading}
              title="Download package itinerary"
            >
              {isCheckingPdf || isPdfLoading ? (
                <div className="btn-preloader"></div>
              ) : (
                <i className="fas fa-download"></i>
              )}
            </button>
            <button
              className="package-action-btn share-btn"
              onClick={handleShare}
              aria-label="Share Package"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        <div className="package-content">
          <h3 className="package-title1">{decodeHtml(pkg.name)}</h3>

          <div className="package-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{pkg.location}</span>
          </div>

          <div className="package-features">
            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-hotel"></i>
                <span>4 Star Hotel</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-mountain"></i>
                <span>
                  {pkg.highlights && pkg.highlights[0]
                    ? pkg.highlights[0]
                    : "Scenic Views"}
                </span>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-monument"></i>
                <span>
                  {pkg.highlights && pkg.highlights[1]
                    ? pkg.highlights[1]
                    : "Famous Sights"}
                </span>
              </div>
              <div className="feature-item">
                <i className="fas fa-umbrella-beach"></i>
                <span>
                  {pkg.highlights && pkg.highlights[2]
                    ? pkg.highlights[2]
                    : "Local Experiences"}
                </span>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-utensils"></i>
                <span>Breakfast & Dinner</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-camera"></i>
                <span>
                  {pkg.highlights && pkg.highlights[3]
                    ? pkg.highlights[3]
                    : "Sightseeing"}
                </span>
              </div>
            </div>
          </div>

          <div className="package-price-container">
            <div className="price-details">
              <div className="original-price">
                ₹{originalPrice.toLocaleString("en-IN")}
              </div>
              <div className="current-price">
                ₹{pkg.price.toLocaleString("en-IN")}
              </div>
              <div className="price-per">per person</div>
            </div>

            <Link
              to={`/package/${generateSlug(pkg.name)}`}
              className="read-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo(0, 0);
              }}
            >
              <i className="fas fa-eye"></i> Read More
            </Link>
          </div>
        </div>
      </div>

      {/* Toast notification will be rendered in a portal at the app level */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </AnimatedElement>
  );
}

export default React.memo(PackageCard);
