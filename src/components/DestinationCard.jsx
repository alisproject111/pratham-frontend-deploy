import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";

const destinationCardStyles = `
.destination-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #eaeaea;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  position: relative;
}
.destination-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
  border-color: #f37121;
}
.destination-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
}
.destination-image-container .destination-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.destination-card:hover .destination-image {
  transform: scale(1.06);
}
.destination-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f37121;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(243, 113, 33, 0.3);
  z-index: 2;
  transition: transform 0.3s ease;
}
.destination-card:hover .destination-badge {
  transform: scale(1.05);
}
.destination-content {
  padding: 16px 8px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.destination-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222222;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
  text-transform: capitalize;
  text-align: left;
}
.destination-card:hover .destination-name {
  color: #f37121;
}
.destination-line {
  width: 24px;
  height: 3px;
  background-color: #f37121;
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.destination-card:hover .destination-line {
  width: 60px;
}
.destination-action-text {
  margin-top: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s ease;
}
.destination-card:hover .destination-action-text {
  color: #f37121;
}
@media (max-width: 576px) {
  .destination-image-container {
    height: 150px;
  }
  .destination-name {
    font-size: 1.05rem;
  }
}
`;

function DestinationCard({ destination }) {
  const navigate = useNavigate();

  // Memoized search query generation
  const generateSearchQuery = useCallback(() => {
    const commonWords = [
      "india",
      "the",
      "and",
      "&",
      "tours",
      "tour",
      "travel",
      "tourism",
      "bliss",
      "explorer",
      "package",
      "packages",
    ];

    const destinationWords = destination.name
      .toLowerCase()
      .split(/[\s,&-]+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word));

    return destinationWords.slice(0, 2).join(" ");
  }, [destination.name]);

  const searchQuery = useMemo(() => generateSearchQuery(), [generateSearchQuery]);

  const handleCardClick = () => {
    navigate(`/packages?destination=${encodeURIComponent(searchQuery)}#package-list`);
  };

  return (
    <div className="destination-card" onClick={handleCardClick}>
      <style dangerouslySetInnerHTML={{ __html: destinationCardStyles }} />
      <div className="destination-image-container">
        <div className="destination-badge">
          {destination.count} {destination.count === 1 ? "Tour" : "Tours"}
        </div>
        <LazyImage
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="destination-image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="destination-content">
        <h3 className="destination-name">{destination.name}</h3>
        <div className="destination-line"></div>
        <div className="destination-action-text">
          <span>Explore Packages</span>
          <i className="fas fa-chevron-right" style={{ fontSize: "0.7rem" }}></i>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;
