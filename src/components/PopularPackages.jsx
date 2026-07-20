import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PackageCard from "./PackageCard"
import AnimatedSection from "./AnimatedSection"
import AnimatedElement from "./AnimatedElement"

const popularPackagesStyles = `
.popular-packages {
    background-color: #f8f9fa;
    position: relative;
    overflow: hidden;
    padding: 60px 0;
}
.popular-packages::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23f0f0f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>');
    background-repeat: repeat;
    background-size: 100px;
    opacity: 0.03;
    z-index: 0;
}
.popular-packages .container {
    position: relative;
    z-index: 1;
}
.popular-packages-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 25px;
    margin-bottom: 40px;
}
.package-card-wrapper {
    /* Relying on AnimatedSection stagger transition to avoid CSS animation and transition conflicts */
}
.no-animation {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
}
.popular-packages-grid.no-animation {
    display: grid;
    opacity: 1;
}
.view-all-container {
    text-align: center;
    margin-top: 30px;
}
.view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background-color: transparent;
    color: #f37121;
    border: 2px solid #f37121;
    border-radius: 4px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: all 0.3s ease;
    text-decoration: none;
}
.view-all-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #f37121;
    transition: width 0.3s ease;
    z-index: -1;
}
.view-all-btn:hover::before {
    width: 100%;
}
.view-all-btn:hover {
    color: white;
}
.view-all-btn i {
    transition: transform 0.3s ease;
}
.view-all-btn:hover i {
    transform: translateX(5px);
}
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@media (max-width: 1200px) {
    .popular-packages-grid {
        gap: 20px;
    }
}
@media (max-width: 992px) {
    .popular-packages {
        padding: 50px 0;
    }
    .popular-packages-grid,
    .popular-packages-grid.no-animation {
        display: flex !important;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }
    .package-card-wrapper {
        flex: 0 1 calc(50% - 10px);
        min-width: 280px;
        max-width: 450px;
        margin: 0 auto;
    }
    .view-all-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
}
@media (max-width: 768px) {
    .popular-packages {
        padding: 40px 0;
    }
    .popular-packages-grid,
    .popular-packages-grid.no-animation {
        display: flex !important;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
    .package-card-wrapper {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        display: block;
        opacity: 1 !important;
        transform: translateY(0) !important;
        animation: none !important;
    }
    .view-all-btn {
        padding: 8px 16px;
        font-size: 0.85rem;
    }
    .animated-element,
    .animated-section {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
    }
    .stagger-children>* {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
    }
}
@media (max-width: 576px) {
    .popular-packages {
        padding: 30px 0;
    }
    .package-card-wrapper {
        max-width: 100%;
    }
    .view-all-container {
        margin-top: 20px;
    }
    .view-all-btn {
        padding: 8px 14px;
        font-size: 0.8rem;
    }
}
`;
import { getCachedPackages, setCachedPackages } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"
import { SkeletonGrid } from "./SkeletonLoader"

const PopularPackages = ({ settings }) => {
  const cachedData = getCachedPackages()
  const [popularPackages, setPopularPackages] = useState(cachedData || [])
  const [loading, setLoading] = useState(!cachedData)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch packages data from API
  useEffect(() => {
    if (cachedData) return

    let active = true
    const fetchPackagesData = async () => {
      try {
        const fetchUrl = `${apiEndpoints.getAllPackages}?limit=6&featured=true`
        console.log("[v0] Fetching packages from:", fetchUrl)

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Packages API response:", data)

        if (data.success && data.packages) {
          if (active) {
            console.log("[v0] Featured packages loaded:", data.packages.length)
            setCachedPackages(data.packages)
            setPopularPackages(data.packages)
            setLoading(false)
          }
        } else {
          throw new Error(data.message || "Failed to fetch packages")
        }
      } catch (error) {
        console.error("[v0] Error fetching packages data, retrying in 3s:", error.message)
        if (active) {
          setTimeout(fetchPackagesData, 3000)
        }
      }
    }

    fetchPackagesData()
    return () => {
      active = false
    }
  }, [cachedData])

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])



  if (loading) {
    return (
      <section className="popular-packages section">
        <style dangerouslySetInnerHTML={{ __html: popularPackagesStyles }} />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{settings?.homePackagesTitle || "Popular Travel Packages - Best Holiday Deals"}</h2>
          </div>
          <SkeletonGrid count={6} />
        </div>
      </section>
    )
  }

  // For mobile, don't use animations
  if (isMobile) {
    return (
      <section className="popular-packages section">
        <style dangerouslySetInnerHTML={{ __html: popularPackagesStyles }} />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{settings?.homePackagesTitle || "Popular Travel Packages - Best Holiday Deals"}</h2>
            <p className="section-subtitle">
              {settings?.homePackagesSubtitle || "Handpicked tour packages with best prices. Domestic India tours & international vacation packages"}
            </p>
          </div>

          <div className="popular-packages-grid no-animation">
            {popularPackages && popularPackages.length > 0 ? (
              popularPackages.map((pkg) => (
                <div key={pkg._id || pkg.id} className="package-card-wrapper no-animation">
                  <PackageCard package={pkg} />
                </div>
              ))
            ) : (
              <p>No packages available</p>
            )}
          </div>

          <div className="view-all-container">
            <Link to="/packages#package-list" className="view-all-btn">
              <span>View All Packages</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // For desktop, use animations
  return (
    <section className="popular-packages section">
      <style dangerouslySetInnerHTML={{ __html: popularPackagesStyles }} />
      <div className="container">
        <AnimatedElement animation="fade-up" threshold={0.1} duration={500}>
          <div className="section-header">
            <h2 className="section-title">{settings?.homePackagesTitle || "Popular Travel Packages - Best Holiday Deals"}</h2>
            <p className="section-subtitle">
              {settings?.homePackagesSubtitle || "Handpicked tour packages with best prices. Domestic India tours & international vacation packages"}
            </p>
          </div>
        </AnimatedElement>

        <AnimatedSection staggered={true} staggerDelay={50} className="popular-packages-grid">
          {popularPackages && popularPackages.length > 0 ? (
            popularPackages.map((pkg) => (
              <div key={pkg._id || pkg.id} className="package-card-wrapper">
                <PackageCard package={pkg} />
              </div>
            ))
          ) : (
            <p>No packages available</p>
          )}
        </AnimatedSection>

        <AnimatedElement animation="fade-up" delay={200} duration={500}>
          <div className="view-all-container">
            <Link to="/packages#package-list" className="view-all-btn">
              <span>View All Packages</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}

export default PopularPackages
