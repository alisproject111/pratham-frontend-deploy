import { useState, useCallback, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { apiEndpoints } from "../config/api"
import { getCachedDestinations, setCachedDestinations } from "../utils/dataCache"

const searchBarStyles = `
  .search-bar-container { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); padding: 2.5rem 2rem; box-shadow: 0 15px 35px rgba(0,0,0,0.1); margin-top: -70px; position: relative; z-index: 10; border-radius: 16px; max-width: 1200px; margin-left: auto; margin-right: auto; transform: translateY(0); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
  .search-bar-container:hover { transform: translateY(-5px); box-shadow: 0 20px 45px rgba(0,0,0,0.15); }
  .search-bar-content { max-width: 1100px; margin: 0 auto; }
  .search-bar-header { text-align: center; margin-bottom: 2rem; }
  .search-title { font-size: 2.2rem; font-weight: 700; color: #2d3748; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 1rem; }
  .search-icon-wrapper { background: linear-gradient(135deg, #f37121 0%, #f99b66 100%); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .search-icon-wrapper i { color: white; font-size: 1.25rem; }
  .search-subtitle { color: #718096; font-size: 1.1rem; font-weight: 400; }
  .search-form { background: #f9f9f9; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .search-fields-container { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
  .search-group { display: flex; flex-direction: column; gap: 0.5rem; position: relative; height: 100%; }
  .search-group label { font-size: 0.95rem; color: #4a5568; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
  .search-group label i { color: #f37121; font-size: 1rem; }
  .input-wrapper { position: relative; height: 100%; }
  .search-input { width: 100%; height: 48px; padding: 0.875rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; transition: all 0.3s ease; color: #2d3748; background: #f8fafc; }
  .search-input:focus { outline: none; border-color: #f37121; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
  .search-input::placeholder { color: #a0aec0; }
  .search-input.error { border-color: #e53e3e; background-color: #fff5f5; }
  .error-message { color: #e53e3e; font-size: 0.875rem; margin-top: 0.5rem; }
  .suggestions-container { position: absolute; top: 100%; left: 0; right: 0; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-top: 5px; z-index: 100; max-height: 200px; overflow-y: auto; }
  .suggestions-list { list-style: none; padding: 0; margin: 0; }
  .suggestion-item { padding: 10px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease; border-left: 3px solid transparent; }
  .suggestion-item:hover, .suggestion-item.focused { background-color: #f7fafc; color: #f37121; border-left: 3px solid #f37121; }
  .suggestion-item i { color: #f37121; font-size: 0.9rem; }
  .custom-dropdown { position: relative; width: 100%; height: 48px; }
  .dropdown-selected { width: 100%; height: 100%; padding: 0.875rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; background: #f8fafc; color: #2d3748; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; }
  .dropdown-selected:hover { border-color: #cbd5e0; background-color: #f1f5f9; }
  .dropdown-selected i { transition: transform 0.3s ease, color 0.3s ease; color: #718096; width: 24px; height: 24px; background-color: rgba(14,165,233,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
  .dropdown-selected:hover i { color: white; background-color: #f37121; }
  .dropdown-selected i.rotate { transform: rotate(180deg); color: white; background-color: #f37121; }
  .dropdown-options { position: absolute; top: 100%; left: 0; right: 0; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-top: 5px; z-index: 100; overflow: hidden; animation: fadeIn 0.2s ease; max-height: 200px; overflow-y: auto; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .dropdown-option { padding: 12px 15px; cursor: pointer; transition: all 0.2s ease; border-left: 3px solid transparent; }
  .dropdown-option:hover, .dropdown-option.focused { background-color: #f7fafc; color: #f37121; border-left: 3px solid #f37121; }
  .search-button { background: linear-gradient(135deg, #f37121 0%, #f99b66 100%); color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; width: max-content; min-width: 200px; margin: 0 auto; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(243,113,33,0.2); }
  .search-button:hover { background: linear-gradient(135deg, #d95e14 0%, #f37121 100%); transform: translateY(-2px); box-shadow: 0 6px 12px rgba(243,113,33,0.3); }
  .search-button i { font-size: 1.1rem; transition: transform 0.3s ease; }
  .search-button:hover i { transform: scale(1.1); }
  .search-button:active { transform: translateY(1px); }
  .filter-buttons { display: flex; gap: 15px; }
  .reset-filter-btn { background-color: transparent; color: #666; border: 1px solid #ddd; padding: 14px 20px; border-radius: 8px; font-weight: 500; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
  .reset-filter-btn:hover { background-color: #f8f9fa; border-color: #ccc; color: #f37121; }
  .reset-filter-btn i { font-size: 1rem; transition: transform 0.3s ease; }
  .reset-filter-btn:hover i { transform: rotate(-45deg); }
  @media (max-width: 992px) { .search-fields-container { grid-template-columns: repeat(2,1fr); } .search-bar-container { padding: 1.5rem 1rem; } .search-title { font-size: 1.8rem; } }
  @media (max-width: 768px) { .search-bar-container { margin-top: -50px; padding: 1.25rem 0.75rem; border-radius: 12px; } .search-title { font-size: 1.5rem; gap: 0.5rem; } .search-icon-wrapper { width: 35px; height: 35px; border-radius: 8px; } .search-subtitle { font-size: 0.9rem; } .search-form { padding: 1rem; } .search-fields-container { grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 1rem; } .search-group label { font-size: 0.85rem; } .search-input, .dropdown-selected { height: 42px; padding: 0.75rem; font-size: 0.9rem; } .filter-buttons { flex-direction: column; gap: 10px; } .search-button, .reset-filter-btn { padding: 0.75rem; font-size: 0.9rem; } }
  @media (max-width: 576px) { .search-bar-container { margin-top: -40px; padding: 1rem 0.5rem; } .search-title { font-size: 1.3rem; } .search-form { padding: 0.75rem; } }
`

function SearchBar() {
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("")
  const [budget, setBudget] = useState("")
  const [sortBy, setSortBy] = useState("price-low")
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
  const [allDestinations, setAllDestinations] = useState([])

  const suggestionsRef = useRef(null)
  const destinationInputRef = useRef(null)
  const durationDropdownRef = useRef(null)
  const budgetDropdownRef = useRef(null)
  const sortByDropdownRef = useRef(null)

  const navigate = useNavigate()

  // Fetch/load destinations for search suggestions
  const loadSearchDestinations = useCallback(async () => {
    // Check cache first
    const cached = getCachedDestinations()
    if (cached && cached.length > 0) {
      const destNames = cached.map((dest) => dest.name).sort()
      setAllDestinations(destNames)
      return destNames
    }

    try {
      console.log("[v0] Fetching search destinations from:", apiEndpoints.getDestinations)
      const response = await fetch(apiEndpoints.getDestinations)
      const data = await response.json()

      if (data.success && data.data.destinations) {
        setCachedDestinations(data.data.destinations)
        const destNames = data.data.destinations.map((dest) => dest.name).sort()
        setAllDestinations(destNames)
        return destNames
      }
    } catch (error) {
      console.error("[v0] Error fetching destinations:", error)
      setAllDestinations([])
    }
    return []
  }, [])

  // Fetch destinations from API with a delay to prioritize initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSearchDestinations()
    }, 1500)

    return () => clearTimeout(timer)
  }, [loadSearchDestinations])

  // Handle destination input change and show suggestions
  const handleDestinationChange = async (e) => {
    const value = e.target.value
    setDestination(value)
    setError("")
    setFocusedSuggestionIndex(-1)

    let currentDestinations = allDestinations
    if (allDestinations.length === 0) {
      currentDestinations = await loadSearchDestinations()
    }

    if (value.trim().length > 0) {
      const filtered = currentDestinations.filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions(currentDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle suggestion selection - Fixed to properly close dropdown
  const handleSelectSuggestion = (suggestion) => {
    setDestination(suggestion)
    setSuggestions([])
    setShowSuggestions(false) // Ensure dropdown is closed
    setFocusedSuggestionIndex(-1)
    destinationInputRef.current?.blur() // Remove focus from input to prevent dropdown from reopening
  }

  // Show suggestions when input is focused - Fixed to not show dropdown if a destination is already selected
  const handleDestinationFocus = async () => {
    let currentDestinations = allDestinations
    if (allDestinations.length === 0) {
      currentDestinations = await loadSearchDestinations()
    }
    // Only show suggestions if the input is empty
    if (!destination.trim()) {
      setSuggestions(currentDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle dropdown toggle
  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
      setFocusedOptionIndex(-1)
    } else {
      setActiveDropdown(dropdown)
      setFocusedOptionIndex(-1)
    }
  }

  // Handle duration selection
  const handleDurationSelect = (value) => {
    setDuration(value)
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Handle budget selection
  const handleBudgetSelect = (value) => {
    setBudget(value)
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Handle sort by selection
  const handleSortBySelect = (value) => {
    setSortBy(value)
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Scroll the focused suggestion into view
  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll(".suggestion-item")
      if (suggestionItems[focusedSuggestionIndex]) {
        suggestionItems[focusedSuggestionIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [focusedSuggestionIndex])

  // Handle keyboard navigation for suggestions
  const handleDestinationKeyDown = (e) => {
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

  // Handle keyboard navigation for dropdown options
  const handleDropdownKeyDown = (e, options, selectHandler) => {
    if (!activeDropdown) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedOptionIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && focusedOptionIndex >= 0) {
      e.preventDefault()
      selectHandler(options[focusedOptionIndex].value)
    }
    // Escape
    else if (e.key === "Escape") {
      setActiveDropdown(null)
      setFocusedOptionIndex(-1)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        destinationInputRef.current &&
        !destinationInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }

      if (
        activeDropdown === "duration" &&
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === "budget" &&
        budgetDropdownRef.current &&
        !budgetDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === "sortBy" &&
        sortByDropdownRef.current &&
        !sortByDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!destination.trim()) {
        setError("Please enter a destination")
        return
      }
      setError("")
      const params = new URLSearchParams()
      if (destination) params.append("destination", destination)
      if (duration) params.append("duration", duration)
      if (budget) params.append("budget", budget)
      if (sortBy) params.append("sortBy", sortBy)
      navigate(`/packages?${params.toString()}#package-list`)
      // Navigate to packages page and scroll to package list
    },
    [destination, duration, budget, sortBy, navigate],
  )

  // Define dropdown options
  const durationOptions = [
    { label: "Any Duration", value: "" },
    { label: "1-3 Days", value: "1-3" },
    { label: "4-7 Days", value: "4-7" },
    { label: "8-14 Days", value: "8-14" },
    { label: "15+ Days", value: "15+" },
  ]

  const budgetOptions = [
    { label: "Any Budget", value: "" },
    { label: "₹0 - ₹20,000", value: "0-20000" },
    { label: "₹20,000 - ₹50,000", value: "20000-50000" },
    { label: "₹50,000 - ₹1,00,000", value: "50000-100000" },
    { label: "₹1,00,000+", value: "100000+" },
  ]

  const sortByOptions = [
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Duration: Short to Long", value: "duration-low" },
    { label: "Duration: Long to Short", value: "duration-high" },
    { label: "Popularity", value: "popularity" },
  ]

  return (
    <div className="search-bar-container">
      <style dangerouslySetInnerHTML={{ __html: searchBarStyles }} />
      <div className="search-bar-content">
        <div className="search-bar-header">
          <h2 className="search-title">
            <span className="search-icon-wrapper">
              <i className="fas fa-search"></i>
            </span>
            Find Your Perfect Holiday Package
          </h2>
          <p className="search-subtitle">
            Search from 100+ destinations across India and abroad. Best travel deals guaranteed!
          </p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-fields-container">
            <div className="search-group">
              <label htmlFor="destination">
                <i className="fas fa-map-marker-alt"></i>
                Destination
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="destination"
                  placeholder="Search destinations: Goa, Kerala, Manali, Dubai, Thailand..."
                  value={destination}
                  onChange={handleDestinationChange}
                  onKeyDown={handleDestinationKeyDown}
                  onFocus={handleDestinationFocus}
                  className={`search-input ${error ? "error" : ""}`}
                  autoComplete="off"
                  ref={destinationInputRef}
                />
                {error && <div className="error-message">{error}</div>}
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-container" ref={suggestionsRef}>
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={`suggestion-item ${focusedSuggestionIndex === index ? "focused" : ""}`}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <i className="fas fa-map-marker-alt"></i>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="duration">
                <i className="fas fa-calendar-alt"></i>
                Duration
              </label>
              <div
                className="custom-dropdown"
                ref={durationDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, durationOptions, handleDurationSelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("duration")}>
                  <span>
                    {duration
                      ? duration === "1-3"
                        ? "1-3 Days"
                        : duration === "4-7"
                          ? "4-7 Days"
                          : duration === "8-14"
                            ? "8-14 Days"
                            : duration === "15+"
                              ? "15+ Days"
                              : "Any Duration"
                      : "Any Duration"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "duration" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "duration" && (
                  <div className="dropdown-options">
                    {durationOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleDurationSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="budget">
                <i className="fas fa-wallet"></i>
                Budget
              </label>
              <div
                className="custom-dropdown"
                ref={budgetDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, budgetOptions, handleBudgetSelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("budget")}>
                  <span>
                    {budget
                      ? budget === "0-20000"
                        ? "₹0 - ₹20,000"
                        : budget === "20000-50000"
                          ? "₹20,000 - ₹50,000"
                          : budget === "50000-100000"
                            ? "₹50,000 - ₹1,00,000"
                            : budget === "100000+"
                              ? "₹1,00,000+"
                              : "Any Budget"
                      : "Any Budget"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "budget" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "budget" && (
                  <div className="dropdown-options">
                    {budgetOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleBudgetSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="sortBy">
                <i className="fas fa-sort"></i>
                Sort By
              </label>
              <div
                className="custom-dropdown"
                ref={sortByDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, sortByOptions, handleSortBySelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("sortBy")}>
                  <span>
                    {sortBy === "price-low"
                      ? "Price: Low to High"
                      : sortBy === "price-high"
                        ? "Price: High to Low"
                        : sortBy === "duration-low"
                          ? "Duration: Short to Long"
                          : sortBy === "duration-high"
                            ? "Duration: Long to Short"
                            : sortBy === "popularity"
                              ? "Popularity"
                              : "Price: Low to High"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "sortBy" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "sortBy" && (
                  <div className="dropdown-options">
                    {sortByOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleSortBySelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="search-button group">
            <span>Search Packages</span>
            <i className="fas fa-search transition-transform group-hover:scale-110"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default SearchBar