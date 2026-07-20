import { useState, useCallback, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import SEOHead from "../components/SEOHead"
import { apiEndpoints } from "../config/api"

const nfStyles = `
  .not-found-page-wrapper { position: relative; width: 100%; min-height: calc(100vh - 140px); margin: 0; padding: 0; box-sizing: border-box; }
  .not-found-page-content { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; min-height: calc(100vh - 140px); }
  .not-found-container { max-width: 1200px; width: 100%; position: relative; z-index: 2; }
  .not-found-page-wrapper .nf-floating-elements { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
  .not-found-page-wrapper .nf-floating-plane { position: absolute; font-size: 2rem; animation: nf-flyAcross 15s linear infinite; top: 20%; }
  .not-found-page-wrapper .nf-floating-cloud { position: absolute; font-size: 1.5rem; opacity: 0.7; animation: nf-floatCloud 20s ease-in-out infinite; }
  .not-found-page-wrapper .nf-cloud-1 { top: 10%; left: 10%; animation-delay: 0s; }
  .not-found-page-wrapper .nf-cloud-2 { top: 30%; right: 15%; animation-delay: -7s; }
  .not-found-page-wrapper .nf-cloud-3 { top: 60%; left: 20%; animation-delay: -14s; }
  @keyframes nf-flyAcross { 0% { left: -5%; transform: rotate(0deg); } 50% { transform: rotate(5deg); } 100% { left: 105%; transform: rotate(0deg); } }
  @keyframes nf-floatCloud { 0%, 100% { transform: translateY(0px) translateX(0px); } 33% { transform: translateY(-20px) translateX(10px); } 66% { transform: translateY(10px) translateX(-5px); } }
  .not-found-page-wrapper .not-found-content { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 3rem; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); text-align: center; position: relative; max-width: 100%; margin: 0 auto; }
  .not-found-page-wrapper .nf-error-illustration { margin-bottom: 2rem; }
  .not-found-page-wrapper .nf-error-number { font-size: 6rem; font-weight: bold; color: #2563eb; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); animation: nf-bounce 2s ease-in-out infinite; }
  @keyframes nf-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
  .not-found-page-wrapper .nf-error-subtitle { font-size: 1.2rem; color: #6b7280; font-weight: 500; }
  .not-found-page-wrapper .nf-error-message { margin-bottom: 3rem; }
  .not-found-page-wrapper .nf-error-message h1 { font-size: 2.5rem; color: #1f2937; margin-bottom: 1rem; font-weight: 700; }
  .not-found-page-wrapper .nf-error-message p { font-size: 1.1rem; color: #6b7280; line-height: 1.6; max-width: 600px; margin: 0 auto; }
  .not-found-page-wrapper .nf-search-section { margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 15px; border: 2px solid #f37121; }
  .not-found-page-wrapper .nf-search-section h3 { font-size: 1.3rem; color: #0c4a6e; margin-bottom: 1.5rem; font-weight: 600; }
  .not-found-page-wrapper .nf-search-form { max-width: 500px; margin: 0 auto; }
  .not-found-page-wrapper .nf-search-input-wrapper { position: relative; display: flex; gap: 0; border-radius: 50px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
  .not-found-page-wrapper .nf-search-input { flex: 1; padding: 1rem 1.5rem; border: none; font-size: 1rem; outline: none; background: white; font-family: inherit; }
  .not-found-page-wrapper .nf-search-input::placeholder { color: #9ca3af; }
  .not-found-page-wrapper .nf-search-btn { padding: 1rem 1.5rem; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: inherit; display: flex; align-items: center; gap: 0.5rem; }
  .not-found-page-wrapper .nf-search-btn:hover { background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); transform: translateY(-1px); }
  .not-found-page-wrapper .nf-suggestions-container { position: absolute; top: 100%; left: 0; right: 80px; background: white; border: 1px solid #e5e7eb; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); z-index: 1000; max-height: 300px; overflow-y: auto; }
  .not-found-page-wrapper .nf-suggestions-list { list-style: none; margin: 0; padding: 0; }
  .not-found-page-wrapper .nf-suggestion-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid #f3f4f6; }
  .not-found-page-wrapper .nf-suggestion-item:hover, .not-found-page-wrapper .nf-suggestion-item.focused { background: #f8fafc; color: #2563eb; }
  .not-found-page-wrapper .nf-suggestion-icon { color: #6b7280; font-size: 0.875rem; }
  .not-found-page-wrapper .nf-suggestion-item span:last-child { font-size: 0.95rem; color: #374151; }
  .not-found-page-wrapper .nf-suggestions-section { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; }
  .not-found-page-wrapper .nf-popular-destinations, .not-found-page-wrapper .nf-quick-links { padding: 1.5rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 15px; border: 2px solid #f59e0b; }
  .not-found-page-wrapper .nf-popular-destinations h3, .not-found-page-wrapper .nf-quick-links h3 { font-size: 1.2rem; color: #92400e; margin-bottom: 1rem; font-weight: 600; }
  .not-found-page-wrapper .nf-destination-links, .not-found-page-wrapper .nf-nav-links { display: flex; flex-direction: column; gap: 0.5rem; }
  .not-found-page-wrapper .nf-destination-link, .not-found-page-wrapper .nf-nav-link { padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.8); color: #1f2937; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.3s ease; border: 1px solid transparent; display: flex; align-items: center; gap: 0.75rem; }
  .not-found-page-wrapper .nf-destination-link:hover, .not-found-page-wrapper .nf-nav-link:hover { background: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-color: #f59e0b; text-decoration: none; color: #1f2937; }
  .not-found-page-wrapper .nf-cta-section { margin-bottom: 2rem; padding: 2rem; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 15px; border: 2px solid #f99b66; }
  .not-found-page-wrapper .nf-cta-content h3 { font-size: 1.4rem; color: #1e40af; margin-bottom: 1rem; font-weight: 600; }
  .not-found-page-wrapper .nf-cta-content p { color: #1e3a8a; margin-bottom: 1.5rem; font-size: 1rem; }
  .not-found-page-wrapper .nf-cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .not-found-page-wrapper .nf-cta-btn { padding: 1rem 1.5rem; text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.5rem; }
  .not-found-page-wrapper .nf-cta-btn.primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; }
  .not-found-page-wrapper .nf-cta-btn.secondary { background: white; color: #2563eb; border: 2px solid #2563eb; }
  .not-found-page-wrapper .nf-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); text-decoration: none; }
  .not-found-page-wrapper .nf-cta-btn.primary:hover { background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: white; }
  .not-found-page-wrapper .nf-cta-btn.secondary:hover { background: #2563eb; color: white; }
  .not-found-page-wrapper .nf-travel-fact { padding: 1.5rem; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border-radius: 15px; border: 2px solid #f37121; }
  .not-found-page-wrapper .nf-fact-content { display: flex; align-items: flex-start; gap: 1rem; text-align: left; }
  .not-found-page-wrapper .nf-fact-icon { font-size: 1.5rem; flex-shrink: 0; }
  .not-found-page-wrapper .nf-fact-content p { color: #5b21b6; font-size: 0.95rem; line-height: 1.5; margin: 0; }
  .not-found-page-wrapper .nf-fact-content strong { color: #4c1d95; }
  @media (max-width: 768px) { .not-found-page-content { min-height: calc(100vh - 120px); padding: 1.5rem 1rem; } .not-found-page-wrapper .not-found-content { padding: 2rem 1.5rem; } .not-found-page-wrapper .nf-error-number { font-size: 4rem; } .not-found-page-wrapper .nf-error-message h1 { font-size: 2rem; } .not-found-page-wrapper .nf-suggestions-section { grid-template-columns: 1fr; gap: 1.5rem; } .not-found-page-wrapper .nf-cta-buttons { flex-direction: column; align-items: center; } .not-found-page-wrapper .nf-cta-btn { width: 100%; max-width: 250px; justify-content: center; } .not-found-page-wrapper .nf-fact-content { flex-direction: column; text-align: center; } .not-found-page-wrapper .nf-floating-plane { font-size: 1.5rem; } .not-found-page-wrapper .nf-floating-cloud { font-size: 1.2rem; } }
  @media (max-width: 480px) { .not-found-page-content { padding: 1rem 0.5rem; min-height: calc(100vh - 100px); } .not-found-page-wrapper .not-found-content { padding: 1.5rem 1rem; } .not-found-page-wrapper .nf-error-number { font-size: 3rem; } .not-found-page-wrapper .nf-error-message h1 { font-size: 1.8rem; } .not-found-page-wrapper .nf-search-input-wrapper { flex-direction: column; border-radius: 15px; } .not-found-page-wrapper .nf-search-input, .not-found-page-wrapper .nf-search-btn { border-radius: 0; } .not-found-page-wrapper .nf-search-input { border-radius: 15px 15px 0 0; } .not-found-page-wrapper .nf-search-btn { border-radius: 0 0 15px 15px; justify-content: center; } .not-found-page-wrapper .nf-suggestions-container { right: 0; } .not-found-page-wrapper .nf-destination-link, .not-found-page-wrapper .nf-nav-link { justify-content: center; } }
`

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [allDestinations, setAllDestinations] = useState([])

  const suggestionsRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("[v0] Fetching 404 page destinations from:", apiEndpoints.getDestinations)
        const response = await fetch(apiEndpoints.getDestinations)
        const data = await response.json()

        if (data.success && data.data.destinations) {
          const destinations = data.data.destinations.map((dest) => dest.name).sort()
          setAllDestinations(destinations)
        }
      } catch (error) {
        console.error("[v0] Error fetching destinations:", error)
        setAllDestinations([])
      }
    }

    fetchDestinations()
  }, [])

  // Extract unique destinations from API response (same as SearchBar)
  const destinations = allDestinations

  // Handle search input change and show suggestions (same logic as SearchBar)
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setFocusedSuggestionIndex(-1)

    if (value.trim().length > 0) {
      // Filter destinations and ensure we use the full name format
      const filtered = destinations
        .filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))
        // Remove duplicates by preferring the longer format (with ", India" suffix)
        .filter((dest, index, self) => {
          const baseLocation = dest.split(",")[0].trim()
          const longerVersionExists = self.some(
            (d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"),
          )

          // Keep this item if it's the longer version or if no longer version exists
          return dest.includes(", India") || !longerVersionExists
        })

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      // Show all destinations when input is cleared, but filter out shorter versions
      const uniqueDestinations = destinations.filter((dest, index, self) => {
        const baseLocation = dest.split(",")[0].trim()
        const longerVersionExists = self.some((d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"))

        return dest.includes(", India") || !longerVersionExists
      })

      setSuggestions(uniqueDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])
    setShowSuggestions(false)
    setFocusedSuggestionIndex(-1)
    searchInputRef.current?.blur()
  }

  // Show suggestions when input is focused
  const handleSearchFocus = () => {
    if (!searchQuery.trim()) {
      // Filter out shorter versions of destinations
      const uniqueDestinations = destinations.filter((dest, index, self) => {
        const baseLocation = dest.split(",")[0].trim()
        const longerVersionExists = self.some((d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"))

        return dest.includes(", India") || !longerVersionExists
      })

      setSuggestions(uniqueDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle keyboard navigation for suggestions
  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedSuggestionIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedSuggestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && focusedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[focusedSuggestionIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
      setFocusedSuggestionIndex(-1)
    }
  }

  // Scroll the focused suggestion into view
  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll(".nf-suggestion-item")
      if (suggestionItems[focusedSuggestionIndex]) {
        suggestionItems[focusedSuggestionIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [focusedSuggestionIndex])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      if (!searchQuery.trim()) {
        return
      }

      // Navigate to packages page with search parameter and scroll to package list
      const params = new URLSearchParams()
      params.append("destination", searchQuery.trim())
      navigate(`/packages?${params.toString()}#package-list`)
    },
    [searchQuery, navigate],
  )

  const popularDestinations = [
    {
      name: "Goa Packages",
      path: "/packages?destination=Goa, India#package-list",
      icon: "🏖️",
    },
    {
      name: "Kerala Tours",
      path: "/packages?destination=Kerala, India#package-list",
      icon: "🌴",
    },
    {
      name: "Manali Trips",
      path: "/packages?destination=Manali, India#package-list",
      icon: "🏔️",
    },
    {
      name: "Bali Tours",
      path: "/packages?destination=Bali, Indonesia#package-list",
      icon: "🌺",
    },
  ]

  const quickLinks = [
    { name: "All Packages", path: "/packages#package-list", icon: "📦" },
    { name: "About Us", path: "/about", icon: "ℹ️" },
    { name: "Contact Us", path: "/contact", icon: "📞" },
    { name: "Home", path: "/", icon: "🏠" },
  ]

  return (
    <>
      <SEOHead
        title="Page Not Found | Pratham Tours"
        description="Oops! The page you're looking for doesn't exist. Explore our amazing travel packages and find your perfect holiday destination with Pratham Tours."
        keywords="404 page, page not found, travel packages, Pratham Tours"
        canonical="https://prathamtours.com/not-found"
      />

      <div className="not-found-page-wrapper">
        <style dangerouslySetInnerHTML={{ __html: nfStyles }} />
        <div className="not-found-page-content">
          <div className="not-found-container">
            {/* Animated Background Elements */}
            <div className="nf-floating-elements">
              <div className="nf-floating-plane">✈️</div>
              <div className="nf-floating-cloud nf-cloud-1">☁️</div>
              <div className="nf-floating-cloud nf-cloud-2">☁️</div>
              <div className="nf-floating-cloud nf-cloud-3">☁️</div>
            </div>

            {/* Main Content */}
            <div className="not-found-content">
              <div className="nf-error-illustration">
                <div className="nf-error-number">4🏝️4</div>
                <div className="nf-error-subtitle">Oops! Looks like you've wandered off the beaten path!</div>
              </div>

              <div className="nf-error-message">
                <h1>Page Not Found</h1>
                <p>
                  Don't worry, even the best explorers sometimes take a wrong turn. Let's get you back on track to your
                  dream destination!
                </p>
              </div>

              {/* Search Section */}
              <div className="nf-search-section">
                <h3>🔍 Search for Your Perfect Trip</h3>
                <form onSubmit={handleSearch} className="nf-search-form">
                  <div className="nf-search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search destinations: Goa, Kerala, Manali, Dubai, Thailand..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={handleSearchFocus}
                      className="nf-search-input"
                      autoComplete="off"
                      ref={searchInputRef}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="nf-suggestions-container" ref={suggestionsRef}>
                        <ul className="nf-suggestions-list">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className={`nf-suggestion-item ${focusedSuggestionIndex === index ? "focused" : ""}`}
                              onClick={() => handleSelectSuggestion(suggestion)}
                            >
                              <span className="nf-suggestion-icon">📍</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button type="submit" className="nf-search-btn">
                      <span className="nf-search-btn-icon">🔍</span>
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Popular Destinations */}
              <div className="nf-suggestions-section">
                <div className="nf-popular-destinations">
                  <h3>🌟 Popular Destinations</h3>
                  <div className="nf-destination-links">
                    {popularDestinations.map((destination, index) => (
                      <Link key={index} to={destination.path} className="nf-destination-link">
                        <span className="nf-link-icon">{destination.icon}</span>
                        <span>{destination.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="nf-quick-links">
                  <h3>🚀 Quick Navigation</h3>
                  <div className="nf-nav-links">
                    {quickLinks.map((link, index) => (
                      <Link key={index} to={link.path} className="nf-nav-link">
                        <span className="nf-link-icon">{link.icon}</span>
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="nf-cta-section">
                <div className="nf-cta-content">
                  <h3>🎯 Ready to Start Your Journey?</h3>
                  <p>Explore our handpicked travel packages and create memories that last a lifetime!</p>
                  <div className="nf-cta-buttons">
                    <Link to="/packages#package-list" className="nf-cta-btn primary">
                      <span className="nf-btn-icon">🎒</span>
                      Explore Packages
                    </Link>
                    <Link to="/" className="nf-cta-btn secondary">
                      <span className="nf-btn-icon">🏠</span>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fun Travel Fact */}
              <div className="nf-travel-fact">
                <div className="nf-fact-content">
                  <span className="nf-fact-icon">💡</span>
                  <p>
                    <strong>Did you know?</strong> The word "travel" comes from the Old French word "travail," which
                    means "work" or "labor." Today, we make travel feel like pure joy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
