import { useState, useEffect, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import SEOHead from "../components/SEOHead"
import AnimatedElement from "../components/AnimatedElement"
import AnimatedSection from "../components/AnimatedSection"
import { getCachedPackageByIdOrSlug, setCachedPackage } from "../utils/dataCache"
import { apiEndpoints, getImageUrl } from "../config/api"
import { generateSlug } from "../utils/slugify"
import { CONTACT_INFO } from "../config/constants"

const pdpStyles = `
  .pdp-package-detail-page { min-height: 100vh; }
  .pdp-package-hero { height: 50vh; min-height: 400px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; }
  .pdp-package-hero-content { position: relative; color: white; padding-bottom: 40px; }
  .pdp-package-location { display: flex; align-items: center; font-size: 0.9rem; margin-bottom: 12px; gap: 5px; }
  .pdp-package-location i { color: #f37121; }
  .pdp-package-title { font-size: 2.2rem; margin-bottom: 10px; font-weight: 600; color: white; }
  .pdp-package-detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-top: 40px; margin-bottom: 60px; }
  .pdp-package-main-content>div { background-color: white; border-radius: 8px; padding: 30px; margin-bottom: 30px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); }
  .pdp-section-title { margin-bottom: 20px; position: relative; padding-bottom: 10px; color: #333; font-size: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .pdp-section-icon { color: #f37121; }
  .pdp-section-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background-color: #f37121; }
  .pdp-package-main-content p { color: #555; line-height: 1.7; margin-bottom: 15px; }
  .pdp-overview-content { margin-top: 20px; }
  .pdp-overview-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; }
  .pdp-feature { display: flex; align-items: center; gap: 10px; }
  .pdp-feature i { color: #f37121; font-size: 1.2rem; width: 30px; height: 30px; background-color: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .pdp-highlights-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
  .pdp-highlight-item { display: flex; align-items: flex-start; gap: 10px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; transition: all 0.3s ease; }
  .pdp-highlight-item:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .pdp-highlight-item i { color: #f37121; font-size: 1rem; margin-top: 2px; }
  .pdp-itinerary-day { border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px; overflow: hidden; transition: transform 0.3s ease; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); }
  .pdp-itinerary-day:hover { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .pdp-day-header { background-color: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #eee; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.3s ease; }
  .pdp-day-header.pdp-active { background-color: #f37121; color: white; }
  .pdp-day-header h3 { margin: 0; color: inherit; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; }
  .pdp-day-number { font-weight: 700; background-color: rgba(0, 0, 0, 0.1); padding: 5px 10px; border-radius: 4px; }
  .pdp-toggle-icon { transition: transform 0.3s ease; }
  .pdp-day-header.pdp-active .pdp-toggle-icon { transform: rotate(180deg); }
  .pdp-day-content { padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease; }
  .pdp-day-content-active { padding: 20px; max-height: 1000px; }
  .pdp-activities-list { margin-top: 10px; padding-left: 0; list-style-type: none; }
  .pdp-activity-item { margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px; padding: 8px 12px; background-color: #f8f9fa; border-radius: 6px; transition: all 0.3s ease; }
  .pdp-activity-item:hover { background-color: #f0f0f0; }
  .pdp-activity-item i { color: #f37121; font-size: 0.7rem; margin-top: 7px; }
  .pdp-package-sidebar { position: sticky; top: 100px; height: fit-content; transition: transform 0.3s ease; }
  .pdp-booking-card, .pdp-why-book-card { background-color: white; border-radius: 8px; padding: 25px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin-bottom: 30px; }
  .pdp-booking-price { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .pdp-price-label { display: block; color: #666; font-size: 0.9rem; margin-bottom: 5px; }
  .pdp-price-value { font-size: 2.5rem; font-weight: 700; color: #f37121; display: block; margin-bottom: 5px; }
  .pdp-price-per { display: block; color: #666; font-size: 0.9rem; }
  .pdp-booking-details { margin-bottom: 25px; }
  .pdp-booking-detail { display: flex; align-items: center; margin-bottom: 15px; gap: 15px; }
  .pdp-booking-detail i { width: 20px; color: #333; }
  .pdp-booking-detail span { color: #555; }
  .pdp-book-now-button, .pdp-inquiry-button { width: 100%; padding: 12px; border-radius: 4px; font-weight: 500; text-align: center; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; overflow: hidden; z-index: 1; transition: color 0.3s ease; cursor: pointer; }
  .pdp-book-now-button { background-color: #f37121; color: white; border: none; }
  .pdp-book-now-button::before { content: ""; position: absolute; top: 0; left: 0; width: 0; height: 100%; background-color: #2563eb; transition: width 0.3s ease; z-index: -1; }
  .pdp-book-now-button:hover::before { width: 100%; }
  .pdp-inquiry-button { background-color: transparent; color: #333; border: 1px solid #ddd; }
  .pdp-inquiry-button::before { content: ""; position: absolute; top: 0; left: 0; width: 0; height: 100%; background-color: #f5f5f5; transition: width 0.3s ease; z-index: -1; }
  .pdp-inquiry-button:hover::before { width: 100%; }
  .pdp-whatsapp-button { width: 100%; padding: 12px; border-radius: 4px; font-weight: 500; text-align: center; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; overflow: hidden; z-index: 1; transition: all 0.3s ease; cursor: pointer; background-color: #25D366; color: white; border: none; }
  .pdp-whatsapp-button::before { content: ""; position: absolute; top: 0; left: 0; width: 0; height: 100%; background-color: #128C7E; transition: width 0.3s ease; z-index: -1; }
  .pdp-whatsapp-button:hover::before { width: 100%; }
  .pdp-whatsapp-button:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3); }
  .pdp-why-book-card h3 { margin-bottom: 20px; position: relative; padding-bottom: 10px; color: #333; }
  .pdp-why-book-card h3::after { content: ""; position: absolute; bottom: 0; left: 0; width: 40px; height: 2px; background-color: #f37121; }
  .pdp-why-book-list { list-style: none; padding: 0; }
  .pdp-why-book-list li { display: flex; align-items: center; margin-bottom: 12px; gap: 15px; padding: 10px; border-radius: 6px; transition: all 0.3s ease; }
  .pdp-why-book-list li:hover { background-color: #f8f9fa; }
  .pdp-why-book-list li i { color: #f37121; }
  .pdp-error-container { text-align: center; padding: 80px 20px; max-width: 600px; margin: 0 auto; }
  .pdp-error-container i { color: #f37121; margin-bottom: 20px; }
  .pdp-error-container h2 { font-size: 2rem; margin-bottom: 15px; color: #333; }
  .pdp-error-container p { color: #666; margin-bottom: 30px; }
  .pdp-back-button { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background-color: #f37121; color: white; border-radius: 4px; transition: all 0.3s ease; font-weight: 500; }
  .pdp-back-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .pdp-loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; }
  .pdp-loading-spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #f37121; border-radius: 50%; animation: pdp-spin 1s linear infinite; }
  @keyframes pdp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @media (max-width: 992px) { .pdp-package-detail-grid { grid-template-columns: 1fr; gap: 20px; } .pdp-package-hero { height: 40vh; min-height: 300px; } .pdp-package-title { font-size: 1.8rem; } .pdp-package-sidebar { position: static; transform: none !important; } .pdp-booking-card, .pdp-why-book-card { padding: 20px; } .pdp-price-value { font-size: 2.2rem; } }
  @media (max-width: 768px) { .pdp-package-hero { height: 35vh; min-height: 250px; } .pdp-package-hero-content { padding-bottom: 30px; } .pdp-package-title { font-size: 1.5rem; } .pdp-package-main-content>div { padding: 18px; margin-bottom: 20px; } .pdp-section-title { font-size: 1.3rem; margin-bottom: 15px; } .pdp-highlights-list { grid-template-columns: 1fr; gap: 10px; } .pdp-overview-features { grid-template-columns: 1fr; gap: 12px; padding: 15px; } .pdp-feature { font-size: 0.9rem; } .pdp-day-header h3 { font-size: 1rem; } .pdp-day-content-active { padding: 15px; } .pdp-booking-card, .pdp-why-book-card { padding: 15px; margin-bottom: 20px; } .pdp-price-value { font-size: 2rem; } .pdp-book-now-button, .pdp-inquiry-button, .pdp-whatsapp-button { padding: 10px; font-size: 0.9rem; } }
  @media (max-width: 576px) { .pdp-package-hero { height: 30vh; min-height: 200px; } .pdp-package-title { font-size: 1.3rem; } .pdp-package-location { font-size: 0.85rem; } .pdp-package-main-content>div { padding: 15px; } .pdp-section-title { font-size: 1.2rem; } .pdp-package-main-content p { font-size: 0.85rem; } .pdp-highlight-item { font-size: 0.85rem; padding: 10px; } .pdp-day-header { padding: 12px 15px; } .pdp-day-header h3 { font-size: 0.95rem; } .pdp-day-number { font-size: 0.8rem; padding: 3px 6px; } .pdp-day-content-active { padding: 12px; font-size: 0.85rem; } .pdp-booking-detail { gap: 10px; font-size: 0.85rem; } .pdp-booking-price { margin-bottom: 15px; padding-bottom: 15px; } .pdp-price-value { font-size: 1.8rem; } }
  @media (max-width: 375px) { .pdp-package-hero { height: 26vh; min-height: 180px; } .pdp-package-title { font-size: 1.15rem; } .pdp-package-main-content>div { padding: 12px; } .pdp-section-title { font-size: 1.1rem; } .pdp-day-header h3 { font-size: 0.85rem; gap: 6px; } .pdp-day-number { font-size: 0.75rem; padding: 2px 5px; } .pdp-price-value { font-size: 1.5rem; } .pdp-book-now-button, .pdp-inquiry-button, .pdp-whatsapp-button { padding: 8px; font-size: 0.8rem; } }
`

function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cachedPackage = getCachedPackageByIdOrSlug(id)
  const [packageData, setPackageData] = useState(cachedPackage)
  const [loading, setLoading] = useState(!cachedPackage)
  const [error, setError] = useState(null)
  const sidebarRef = useRef(null)
  const footerRef = useRef(null)
  const [activeItinerary, setActiveItinerary] = useState(null)

  // Resolve image URL
  const resolveImageUrl = (image) => {
    return getImageUrl(image);
  };

  // Decode HTML entities (e.g. &amp; → &, double-encoded &amp;amp; → &)
  const decodeHtml = (str) => {
    if (!str || typeof str !== 'string') return str;
    let decoded = str;
    // Run twice to handle double-encoding like &amp;amp;
    for (let i = 0; i < 2; i++) {
      decoded = decoded
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
    }
    return decoded;
  };


  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    if (cachedPackage) return

    let active = true

    // Normalize slug for fuzzy comparison (strip html entity remnants like amp-amp)
    const normalizeSlug = (s) =>
      (s || '').toLowerCase()
        .replace(/[-_]+amp[-_]+amp[-_]*/g, '-') // amp-amp → -
        .replace(/[-_]+amp[-_]*/g, '-')          // amp → -
        .replace(/[-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const fetchPackageData = async () => {
      try {
        const fetchUrl = apiEndpoints.getPackageById(id)
        console.log("[v0] Fetching package from:", fetchUrl)

        const response = await fetch(fetchUrl)

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.package) {
            if (active) {
              setCachedPackage(id, data.package)
              setPackageData(data.package)
              setError(null)
              setLoading(false)
            }
            return;
          }
        }

        // Fallback: 404 or not found — try fetching all packages and fuzzy-match
        console.log("[v0] Direct fetch failed, trying fuzzy slug match...")
        const allRes = await fetch(apiEndpoints.getAllPackages)
        const allData = await allRes.json()

        if (allData.success && allData.packages) {
          const normalizedId = normalizeSlug(id)
          const match = allData.packages.find(pkg => {
            const pkgSlug = generateSlug(pkg.name)
            return pkgSlug === id ||                           // exact match
              normalizeSlug(pkgSlug) === normalizedId ||      // normalized match
              normalizeSlug(id) === normalizeSlug(pkgSlug)   // both normalized
          })

          if (match && active) {
            const correctSlug = generateSlug(match.name)
            // Redirect to correct URL if slug was wrong
            if (correctSlug !== id) {
              console.log(`[v0] Redirecting: ${id} → ${correctSlug}`)
              navigate(`/package/${correctSlug}`, { replace: true })
              return
            }
            setCachedPackage(id, match)
            setPackageData(match)
            setError(null)
            setLoading(false)
            return
          }
        }

        throw new Error("Package not found")
      } catch (err) {
        console.error("[v0] Error fetching package, retrying in 3s:", err)
        if (active) {
          setTimeout(fetchPackageData, 3000)
        }
      }
    }

    fetchPackageData()
    return () => {
      active = false
    }
  }, [id, cachedPackage, navigate])


  // Effect for sticky sidebar that stays visible until footer
  useEffect(() => {
    if (!sidebarRef.current || !footerRef.current) return

    const handleScroll = () => {
      const sidebar = sidebarRef.current
      const footer = document.querySelector("footer")

      if (!sidebar || !footer) return

      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // If footer is in view, adjust sidebar position
      if (footerRect.top < windowHeight) {
        const distanceToFooter = footerRect.top - windowHeight
        sidebar.style.transform = `translateY(${distanceToFooter}px)`
      } else {
        sidebar.style.transform = "translateY(0)"
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  // Format duration as nights/days (e.g., 4N/5D)
  const formatDuration = (days) => {
    const nights = days - 1
    return `${nights}N/${days}D`
  }

  // Handle booking - navigate to booking page
  const handleBookNow = () => {
    navigate(`/booking/${generateSlug(packageData.name)}`)
  }

  // Handle inquiry
  const handleInquiry = () => {
    navigate("/contact", { state: { inquiry: packageData?.name } })
  }

  // Toggle itinerary day
  const toggleItinerary = (dayIndex) => {
    if (activeItinerary === dayIndex) {
      setActiveItinerary(null)
    } else {
      setActiveItinerary(dayIndex)
    }
  }

  // Handle WhatsApp inquiry
  const handleWhatsAppInquiry = () => {
    if (!packageData) return
    
    const packageUrl = window.location.href
    const message = `Hello Pratham Tours,

I am interested in the ${packageData.name} package.

Package: ${packageData.name}
Duration: ${formatDuration(packageData.duration)}
Price: ₹${packageData.price.toLocaleString("en-IN")} per person
Package Link: ${packageUrl}

Please share more details and availability for this package.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}?text=${encodedMessage}`
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <div className="pdp-loading-container">
        <div className="pdp-loading-spinner"></div>
        <p>Loading package details...</p>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="pdp-error-container">
        <i className="fas fa-exclamation-circle fa-3x"></i>
        <h2>Error</h2>
        <p>{error || "Package not found"}</p>
        <Link to="/packages" className="pdp-back-button">
          <i className="fas fa-arrow-left"></i> Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="pdp-package-detail-page">
      <style dangerouslySetInnerHTML={{ __html: pdpStyles }} />
      <SEOHead
        title={`${packageData.name} - ${formatDuration(packageData.duration)} Tour Package | Pratham Tours`}
        description={`Book ${packageData.name} tour package for ${formatDuration(
          packageData.duration,
        )} starting from ₹${packageData.price.toLocaleString("en-IN")}. ${
          packageData.description
        } Best prices guaranteed!`}
        keywords={`${packageData.name}, ${packageData.location}, tour package, travel package, holiday package, ${
          packageData.highlights ? packageData.highlights.join(", ") : ""
        }, ${formatDuration(packageData.duration)} tour, Pratham Tours`}
        canonical={`https://prathamtours.com/package/${generateSlug(packageData.name)}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: packageData.name,
          description: packageData.description,
          url: `https://prathamtours.com/package/${generateSlug(packageData.name)}`,
          image: packageData.detailImage || packageData.image,
          offers: {
            "@type": "Offer",
            price: packageData.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "TravelAgency",
              name: "Pratham Tours",
            },
          },
          provider: {
            "@type": "TravelAgency",
            name: "Pratham Tours",
            url: "https://prathamtours.com",
          },
          duration: `P${packageData.duration}D`,
          touristType: "Leisure",
        }}
      />
      <div
        className="pdp-package-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            resolveImageUrl(packageData.detailImage || packageData.image)
          })`,
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="pdp-package-hero-content">
              <h1 className="pdp-package-title">{decodeHtml(packageData.name)}</h1>
              <div className="pdp-package-location">
                <i className="fas fa-map-marker-alt"></i>
                <span>{packageData.location}</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        <div className="pdp-package-detail-grid">
          <div className="pdp-package-main-content">
            <AnimatedElement animation="fade-right">
              <div className="pdp-package-overview">
                <h2 className="pdp-section-title">
                  <i className="fas fa-info-circle pdp-section-icon"></i>
                  Overview
                </h2>
                <div className="pdp-overview-content">
                  <p>{packageData.description}</p>
                  <p>
                    Experience the beauty and culture of this amazing destination with our carefully crafted itinerary.
                    Our package ensures you get the best experience with comfortable accommodations, guided tours, and
                    authentic local experiences.
                  </p>
                  <div className="pdp-overview-features">
                    <div className="pdp-feature">
                      <i className="fas fa-hotel"></i>
                      <span>Premium Accommodations</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-utensils"></i>
                      <span>Daily Breakfast</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-car"></i>
                      <span>Private Transfers</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-user-tie"></i>
                      <span>Expert Guides</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right" delay={200}>
              <div className="pdp-package-highlights-section">
                <h2 className="pdp-section-title">
                  <i className="fas fa-star pdp-section-icon"></i>
                  Highlights
                </h2>
                <ul className="pdp-highlights-list">
                  {packageData.highlights &&
                    packageData.highlights.map((highlight, index) => (
                      <li key={index} className="pdp-highlight-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{highlight}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right" delay={400}>
              <div className="pdp-package-itinerary">
                <h2 className="pdp-section-title">
                  <i className="fas fa-route pdp-section-icon"></i>
                  Itinerary
                </h2>
                <AnimatedSection staggered={true} staggerDelay={150} className="pdp-itinerary-days">
                  {packageData.itinerary && packageData.itinerary.length > 0
                    ? packageData.itinerary.map((day, index) => (
                        <div key={index} className="pdp-itinerary-day">
                          <div
                            className={`pdp-day-header ${activeItinerary === index ? "pdp-active" : ""}`}
                            onClick={() => toggleItinerary(index)}
                          >
                            <h3>
                              <span className="pdp-day-number">Day {day.day}</span>
                              {day.title}
                            </h3>
                            <i
                              className={`fas ${
                                activeItinerary === index ? "fa-chevron-up" : "fa-chevron-down"
                              } pdp-toggle-icon`}
                            ></i>
                          </div>
                          <div
                            className={`pdp-day-content ${activeItinerary === index ? "pdp-day-content-active" : ""}`}
                          >
                            <p>{day.description}</p>
                            <ul className="pdp-activities-list">
                              {day.activities &&
                                day.activities.map((activity, i) => (
                                  <li key={i} className="pdp-activity-item">
                                    <i className="fas fa-circle-dot"></i> {activity}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    : // Fallback if itinerary is not available
                      [...Array(packageData.duration || 1)].map((_, index) => (
                        <div key={index} className="pdp-itinerary-day">
                          <div
                            className={`pdp-day-header ${activeItinerary === index ? "pdp-active" : ""}`}
                            onClick={() => toggleItinerary(index)}
                          >
                            <h3>
                              <span className="pdp-day-number">Day {index + 1}</span>
                              Exploration Day
                            </h3>
                            <i
                              className={`fas ${
                                activeItinerary === index ? "fa-chevron-up" : "fa-chevron-down"
                              } pdp-toggle-icon`}
                            ></i>
                          </div>
                          <div
                            className={`pdp-day-content ${activeItinerary === index ? "pdp-day-content-active" : ""}`}
                          >
                            <p>Explore the beautiful destination and enjoy local attractions and experiences.</p>
                            <ul className="pdp-activities-list">
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Morning: Breakfast at hotel
                              </li>
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Afternoon: Guided tour
                              </li>
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Evening: Free time for exploration
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                </AnimatedSection>
              </div>
            </AnimatedElement>
          </div>

          <div className="pdp-package-sidebar" ref={sidebarRef}>
            <AnimatedElement animation="fade-left">
              <div className="pdp-booking-card pdp-sticky-sidebar">
                <div className="pdp-booking-price">
                  <span className="pdp-price-label">From</span>
                  <span className="pdp-price-value">₹{packageData.price.toLocaleString("en-IN")}</span>
                  <span className="pdp-price-per">per person</span>
                </div>

                <div className="pdp-booking-details">
                  <div className="pdp-booking-detail">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{formatDuration(packageData.duration)}</span>
                  </div>
                  <div className="pdp-booking-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{packageData.location}</span>
                  </div>
                  <div className="pdp-booking-detail">
                    <i className="fas fa-users"></i>
                    <span>Max People: 20</span>
                  </div>
                </div>

                <button className="pdp-book-now-button" onClick={handleBookNow}>
                  <i className="fas fa-credit-card"></i> Book Now
                </button>

                <a href={`tel:${CONTACT_INFO.PHONE_NUMBER}`}>
                  <button className="pdp-book-now-button">
                    <i className="fas fa-phone"></i> Call Now
                  </button>
                </a>

                <button className="pdp-inquiry-button" onClick={handleInquiry}>
                  <i className="fas fa-envelope"></i> Send Inquiry
                </button>

                <button className="pdp-whatsapp-button" onClick={handleWhatsAppInquiry}>
                  <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                </button>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-left" delay={300}>
              <div className="pdp-why-book-card">
                <h3>Why Book With Us</h3>
                <ul className="pdp-why-book-list">
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>No Booking Fees</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Best Price Guarantee</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Free Cancellation</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>24/7 Customer Support</span>
                  </li>
                </ul>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
      <div ref={footerRef}></div>
    </div>
  )
}

export default PackageDetailPage
