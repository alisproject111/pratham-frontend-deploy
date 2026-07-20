import { useState, useEffect, useRef, useCallback } from "react"
import DestinationCard from "./DestinationCard"
import AnimatedElement from "./AnimatedElement"
import { getCachedDestinations, setCachedDestinations } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"

const monthlyPackagesStyles = `
.monthly-destinations {
  background-color: #f8f9fa;
  position: relative;
  padding: 60px 0;
}
.month-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 30px;
}
.month-btn {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  cursor: pointer;
}
.month-btn:hover {
  background-color: #f0f0f0;
}
.month-btn.active {
  background-color: #f37121;
  color: white;
  border-color: #f37121;
}
.monthly-destinations-container {
  position: relative;
  padding: 0 40px;
}
.destinations-scroll-container {
  position: relative;
  overflow: hidden;
}
.scroll-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;
  padding: 0 10px;
}
.scroll-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.scroll-button:hover:not(.disabled) {
  background-color: #f37121;
  color: white;
  border-color: #f37121;
}
.scroll-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #ccc;
}
.destinations-scroll {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 10px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  min-height: 300px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
  touch-action: pan-x;
  user-select: none;
}
.destinations-scroll>* {
  scroll-snap-align: start;
  flex-shrink: 0;
}
.destinations-scroll::-webkit-scrollbar {
  display: none;
}
.no-destinations {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
.no-destinations i {
  font-size: 3rem;
  color: #f37121;
  margin-bottom: 15px;
}
@media (max-width: 1200px) {
  .destinations-scroll {
    max-width: 100%;
    min-height: 280px;
  }
  .month-btn {
    font-size: 0.8rem;
  }
}
@media (max-width: 992px) {
  .monthly-destinations {
    padding: 50px 0;
  }
  .destinations-scroll {
    max-width: 100%;
    min-height: 260px;
  }
  .month-btn {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
  .scroll-button {
    width: 36px;
    height: 36px;
  }
  .no-destinations {
    padding: 30px;
  }
  .no-destinations i {
    font-size: 2.5rem;
  }
}
@media (max-width: 768px) {
  .monthly-destinations {
    padding: 40px 0;
  }
  .month-selector {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 10px;
    justify-content: flex-start;
    scrollbar-width: none;
    -ms-overflow-style: none;
    gap: 5px;
  }
  .month-selector::-webkit-scrollbar {
    display: none;
  }
  .month-btn {
    flex: 0 0 auto;
    padding: 4px 8px;
    font-size: 0.7rem;
  }
  .monthly-destinations-container {
    padding: 0 30px;
  }
  .destinations-scroll {
    max-width: 100%;
    min-height: 240px;
    gap: 15px;
    scroll-snap-type: x mandatory;
  }
  .scroll-button {
    width: 32px;
    height: 32px;
  }
  .no-destinations {
    padding: 25px;
    font-size: 0.9rem;
  }
  .no-destinations i {
    font-size: 2rem;
  }
}
@media (max-width: 576px) {
  .monthly-destinations {
    padding: 30px 0;
  }
  .monthly-destinations-container {
    padding: 0 25px;
  }
  .destinations-scroll {
    max-width: 100%;
    min-height: 220px;
    gap: 12px;
  }
  .scroll-button {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  .no-destinations {
    padding: 20px;
    font-size: 0.85rem;
  }
}
@media (max-width: 375px) {
  .monthly-destinations-container {
    padding: 0 20px;
  }
  .destinations-scroll {
    max-width: 100%;
    min-height: 200px;
  }
  .scroll-button {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
}
`;

function MonthlyDestinations() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [isPaused, setIsPaused] = useState(false)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [scrollDirection, setScrollDirection] = useState("right")
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isTouchScrolling, setIsTouchScrolling] = useState(false)
  const windowScrolling = useRef(false)
  
  // Monitor page scroll to pause auto-scrolling horizontal cards during vertical page scroll
  useEffect(() => {
    let scrollTimeout;
    const handleWindowScroll = () => {
      windowScrolling.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        windowScrolling.current = false;
      }, 200);
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const cachedDestinations = getCachedDestinations()

  const [packagesData, setPackagesData] = useState({
    packages: [],
    destinations: cachedDestinations || [],
  })
  const [loading, setLoading] = useState(!cachedDestinations)
  const destinationsRef = useRef(null)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    if (cachedDestinations) return

    let active = true
    const fetchPackagesData = async () => {
      try {
        console.log("[v0] Fetching destinations from:", apiEndpoints.getDestinations)

        const response = await fetch(apiEndpoints.getDestinations, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Monthly destinations API response:", data)

        if (data.success && data.data?.destinations) {
          if (active) {
            setCachedDestinations(data.data.destinations)
            setPackagesData({
              packages: [],
              destinations: data.data.destinations || [],
            })
            setLoading(false)
          }
        } else {
          throw new Error("Failed to fetch destinations data")
        }
      } catch (err) {
        console.error("[v0] Error fetching destinations data, retrying in 3s:", err.message)
        if (active) {
          setTimeout(fetchPackagesData, 3000)
        }
      }
    }

    fetchPackagesData()
    return () => {
      active = false
    }
  }, [cachedDestinations])

  const [monthlyDestinationsList, setMonthlyDestinationsList] = useState([])

  // Check if scroll has reached the end or beginning
  const checkScrollPosition = useCallback(() => {
    if (!destinationsRef || !destinationsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = destinationsRef.current

    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)

    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setScrollDirection("left")
    } else if (scrollLeft <= 10 && scrollDirection === "left") {
      setScrollDirection("right")
    }
  }, [scrollDirection])

  useEffect(() => {
    if (!loading && packagesData.destinations.length > 0) {
      const destinations = packagesData.destinations.filter(
        (dest) => dest.favorableMonths && dest.favorableMonths.includes(currentMonth)
      )
      setMonthlyDestinationsList(destinations)

      if (destinationsRef.current) {
        destinationsRef.current.scrollLeft = 0
      }

      const timer = setTimeout(() => {
        checkScrollPosition()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [currentMonth, packagesData, loading, checkScrollPosition])

  const handleMonthChange = (month) => {
    setCurrentMonth(month)
  }

  const scroll = (direction) => {
    if (!destinationsRef || !destinationsRef.current) return

    setAutoScrollEnabled(false)

    const cardWidth = 270
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth
    destinationsRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })

    setTimeout(() => {
      checkScrollPosition()
      setTimeout(() => {
        setAutoScrollEnabled(true)
      }, 2000)
    }, 300)
  }

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchScrolling(true)
      setAutoScrollEnabled(false)
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsTouchScrolling(false)
        setAutoScrollEnabled(true)
      }, 1500)
    }

    const currentRef = destinationsRef.current
    if (currentRef) {
      currentRef.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      })
      currentRef.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      })
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("touchstart", handleTouchStart)
        currentRef.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [])

  useEffect(() => {
    let lastRun = 0
    let throttleTimeout

    const handleScroll = () => {
      const now = Date.now()

      if (!isTouchScrolling) {
        setAutoScrollEnabled(false)

        clearTimeout(window.monthlyScrollTimeout)
        window.monthlyScrollTimeout = setTimeout(() => {
          setAutoScrollEnabled(true)
        }, 2000)
      }

      // Throttle checking scroll position (forces reflow) to at most once per 150ms
      if (now - lastRun > 150) {
        checkScrollPosition()
        lastRun = now
      } else {
        clearTimeout(throttleTimeout)
        throttleTimeout = setTimeout(() => {
          checkScrollPosition()
        }, 150)
      }
    }

    const currentRef = destinationsRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll, {
        passive: true,
      })
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll)
      }
      clearTimeout(window.monthlyScrollTimeout)
      clearTimeout(throttleTimeout)
    }
  }, [scrollDirection, isTouchScrolling, checkScrollPosition])

  useEffect(() => {
    if (!autoScrollEnabled || monthlyDestinationsList.length === 0 || isTouchScrolling) return

    const scrollDestinations = () => {
      if (windowScrolling.current) return // Pause auto-scrolling during page scroll
      if (destinationsRef.current && !isPaused) {
        const cardWidth = 1

        destinationsRef.current.scrollBy({
          left: scrollDirection === "right" ? cardWidth : -cardWidth,
          behavior: "auto",
        })
      }
    }

    // Increase interval from 30ms to 60ms to reduce main thread layout work
    const scrollInterval = setInterval(scrollDestinations, 60)

    return () => clearInterval(scrollInterval)
  }, [isPaused, monthlyDestinationsList, autoScrollEnabled, scrollDirection, isTouchScrolling])

  if (loading) {
    return (
      <section className="monthly-destinations section" id="monthly-destinations">
        <style dangerouslySetInnerHTML={{ __html: monthlyPackagesStyles }} />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Loading destinations...</h2>
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="monthly-destinations section" id="monthly-destinations">
      <style dangerouslySetInnerHTML={{ __html: monthlyPackagesStyles }} />
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header">
            <h2 className="section-title">Best Destinations for {months[currentMonth]}</h2>
            <p className="section-subtitle">Discover the perfect places to visit this month</p>
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={200}>
          <div className="month-selector">
            {months.map((month, index) => (
              <button
                key={index}
                className={`month-btn ${index === currentMonth ? "active" : ""}`}
                onClick={() => handleMonthChange(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={400}>
          <div className="monthly-destinations-container">
            <div className="scroll-buttons">
              <button
                className={`scroll-button ${!canScrollLeft ? "disabled" : ""}`}
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                disabled={!canScrollLeft}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className={`scroll-button ${!canScrollRight ? "disabled" : ""}`}
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                disabled={!canScrollRight}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="destinations-scroll-container">
              <div
                className="destinations-scroll"
                ref={destinationsRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {monthlyDestinationsList && monthlyDestinationsList.length > 0 ? (
                  monthlyDestinationsList.map((destination, index) => {
                    return (
                      <DestinationCard key={`${destination.id || destination._id}-${index}`} destination={destination} />
                    )
                  })
                ) : (
                  <div className="no-destinations">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>No destinations available for this month. Please check other months.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}

export default MonthlyDestinations