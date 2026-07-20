import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import PackageList from "../components/PackageList";
import SEOHead from "../components/SEOHead";
import AnimatedElement from "../components/AnimatedElement";
import CustomizePackageButton from "../components/CustomizePackageButton";

const pageStyles = `
  .packages-page { min-height: 100vh; }
  .packages-header { background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"); background-size: cover; background-position: center; padding: 80px 0; text-align: center; margin-bottom: 40px; }
  .package-type-selector { display: flex; justify-content: center; gap: 15px; margin: 30px 0; flex-wrap: wrap; }
  .package-type-btn { padding: 12px 20px; border-radius: 8px; background-color: #f8f9fa; border: 2px solid #e2e8f0; color: #4a5568; font-weight: 500; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; cursor: pointer; }
  .package-type-btn:hover { background-color: #f1f5f9; border-color: #cbd5e0; transform: translateY(-2px); }
  .package-type-btn.active { background-color: #f37121; color: white; border-color: #f37121; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2); }
  .package-type-btn i { font-size: 1rem; }
  @media (max-width: 992px) { .packages-header { padding: 60px 0; } .package-type-btn { padding: 10px 16px; font-size: 0.9rem; } }
  @media (max-width: 768px) { .packages-header { padding: 40px 0; margin-bottom: 30px; } .package-type-selector { flex-direction: column; gap: 10px; margin: 20px 0; } .package-type-btn { width: 100%; justify-content: center; padding: 10px; } }
  @media (max-width: 576px) { .packages-header { padding: 30px 0; } .page-title { font-size: 1.8rem; } .page-subtitle { font-size: 0.9rem; } }
`

function PackagesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [packageType, setPackageType] = useState("all"); // "all", "domestic", or "international"

  // Parse URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      destination: searchParams.get("destination") || "",
      duration: searchParams.get("duration") || "",
      budget: searchParams.get("budget") || "",
      sortBy: searchParams.get("sortBy") || "price-low",
    };

    const type = searchParams.get("type") || "all";
    setPackageType(type);

    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    setIsLoading(false);

    // Scroll to package list if hash is present
    if (location.hash === "#package-list") {
      setTimeout(() => {
        const element = document.getElementById("package-list");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [location.search, location.hash]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters) => {
      setIsLoading(true);
      setAppliedFilters(newFilters);

      // Update URL with new filters
      const searchParams = new URLSearchParams(location.search);

      // Clear existing filter parameters
      searchParams.delete("destination");
      searchParams.delete("duration");
      searchParams.delete("budget");
      searchParams.delete("sortBy");

      // Set new filter parameters
      if (newFilters.destination)
        searchParams.set("destination", newFilters.destination);
      if (newFilters.duration)
        searchParams.set("duration", newFilters.duration);
      if (newFilters.budget) searchParams.set("budget", newFilters.budget);
      if (newFilters.sortBy) searchParams.set("sortBy", newFilters.sortBy);
      if (packageType !== "all") searchParams.set("type", packageType);

      // Reset to page 1 when filters change
      searchParams.set("page", "1");

      // Navigate to new URL
      navigate(`${location.pathname}?${searchParams.toString()}#package-list`);

      // Short timeout to allow for loading state to be visible
      setTimeout(() => setIsLoading(false), 300);
    },
    [navigate, location.pathname, packageType, location.search]
  );

  // Handle package type change
  const handlePackageTypeChange = (type) => {
    setIsLoading(true);
    setPackageType(type);

    // Update URL with new type
    const searchParams = new URLSearchParams(location.search);
    if (type === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }

    // Reset to page 1 when changing package type
    searchParams.set("page", "1");

    // Navigate to new URL
    navigate(`${location.pathname}?${searchParams.toString()}#package-list`);

    // Short timeout to allow for loading state to be visible
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="packages-page">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <SEOHead
        title={
          packageType === "domestic"
            ? "Domestic Tour Packages | Pratham Tours"
            : packageType === "international"
            ? "International Tour Packages | Pratham Tours"
            : "Travel Packages - Domestic & International Tour Packages | Pratham Tours"
        }
        description="Browse our extensive collection of travel packages. Domestic tours to Goa, Kerala, Manali, Rajasthan & international packages to Bali, Thailand, Vietnam. Book now with best prices!"
        keywords="travel packages, tour packages, holiday packages, domestic tour packages, international tour packages, vacation packages, India tour packages, Goa packages, Kerala packages, Manali packages, Bali packages, Thailand packages, Vietnam packages, affordable travel packages, best travel deals"
        canonical="https://prathamtours.com/packages"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Travel Packages",
          description:
            "Complete list of domestic and international travel packages",
          url: "https://prathamtours.com/packages",
          numberOfItems: "50+",
        }}
      />
      <div
        className="packages-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/hero/packages-header.webp)`, // Updated path
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="page-title">Best Travel & Holiday Packages</h1>
            <p className="page-subtitle">
              Domestic & International Tour Packages at Best Prices
            </p>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        <AnimatedElement animation="fade-up">
          <FilterBar
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </AnimatedElement>

        <div id="package-list" className="package-type-selector">
          <button
            className={`package-type-btn ${
              packageType === "all" ? "active" : ""
            }`}
            onClick={() => handlePackageTypeChange("all")}
          >
            <i className="fas fa-globe"></i> All Packages
          </button>
          <button
            className={`package-type-btn ${
              packageType === "domestic" ? "active" : ""
            }`}
            onClick={() => handlePackageTypeChange("domestic")}
          >
            <i className="fas fa-map-marker-alt"></i> Domestic Packages
          </button>
          <button
            className={`package-type-btn ${
              packageType === "international" ? "active" : ""
            }`}
            onClick={() => handlePackageTypeChange("international")}
          >
            <i className="fas fa-plane"></i> International Packages
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding packages...</p>
          </div>
        ) : (
          <AnimatedElement animation="fade-up" delay={300}>
            <PackageList filters={appliedFilters} packageType={packageType} />
          </AnimatedElement>
        )}
      </div>
      <CustomizePackageButton />
    </div>
  );
}

export default PackagesPage;