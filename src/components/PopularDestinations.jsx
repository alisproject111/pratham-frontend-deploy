import { useEffect, useState } from "react"
import DestinationCard from "./DestinationCard"
import AnimatedElement from "./AnimatedElement"
import { getCachedDestinations, setCachedDestinations } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"

const popularDestinationsStyles = `
.popular-destinations {
  padding: 60px 0;
  background-color: #ffffff;
  position: relative;
}
.destination-section {
  margin-bottom: 40px;
  position: relative;
}
.destination-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.destination-section-title {
  font-size: 1.5rem;
  color: #333;
  position: relative;
  padding-bottom: 8px;
}
.destination-section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #f37121;
}
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 15px;
}
.destinations-grid > * {
  width: 100% !important;
  flex: none !important;
}
@media (max-width: 992px) {
  .destinations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .destination-section-title {
    font-size: 1.3rem;
  }
}
@media (max-width: 576px) {
  .destinations-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .popular-destinations {
    padding: 40px 0;
  }
  .destination-section-title {
    font-size: 1.15rem;
  }
}
`;

const indianKeywords = [
  "india", "kerala", "goa", "kashmir", "manali", "rajasthan", "himachal", 
  "uttarakhand", "sikkim", "andaman", "ladakh", "darjeeling", "meghalaya", 
  "mumbai", "delhi", "gujarat", "karnataka", "tamil nadu", "munnar", 
  "wayanad", "ooty", "coorg", "agra", "jaipur", "udaipur", "jaisalmer",
  "rishikesh", "shimla", "dalhousie", "dharamshala", "north east", 
  "northeast", "assam", "arunachal"
];

const isDomestic = (destName) => {
  if (!destName) return false;
  const lowerName = destName.toLowerCase();
  return indianKeywords.some(keyword => lowerName.includes(keyword));
};

const PopularDestinations = ({ onLoadComplete }) => {
  const cachedDestinations = getCachedDestinations()

  const initialDomestic = cachedDestinations
    ? cachedDestinations.filter((dest) => isDomestic(dest.name)).slice(0, 6)
    : []

  const initialInternational = cachedDestinations
    ? cachedDestinations.filter((dest) => !isDomestic(dest.name)).slice(0, 6)
    : []

  const [domesticDestinations, setDomesticDestinations] = useState(initialDomestic)
  const [internationalDestinations, setInternationalDestinations] = useState(initialInternational)
  const [loading, setLoading] = useState(!cachedDestinations)

  useEffect(() => {
    if (!loading) {
      if (onLoadComplete) onLoadComplete()
    }
  }, [loading, onLoadComplete])

  useEffect(() => {
    if (cachedDestinations) return

    let active = true
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching destinations from:", apiEndpoints.getDestinations)
        const destResponse = await fetch(apiEndpoints.getDestinations)
        const destData = await destResponse.json()
        const destinations = destData.data?.destinations || []

        const domesticDest = destinations.filter((dest) => isDomestic(dest.name)).slice(0, 6)
        const internationalDest = destinations.filter((dest) => !isDomestic(dest.name)).slice(0, 6)

        if (active) {
          setCachedDestinations(destinations)
          setDomesticDestinations(domesticDest)
          setInternationalDestinations(internationalDest)
          setLoading(false)
        }
      } catch (error) {
        console.error("[v0] Error fetching destinations, retrying in 3s:", error)
        if (active) {
          setTimeout(fetchData, 3000)
        }
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [cachedDestinations])

  return (
    <section className="popular-destinations section">
      <style dangerouslySetInnerHTML={{ __html: popularDestinationsStyles }} />
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header">
            <h2 className="section-title">Top Travel Destinations - India & International</h2>
            <p className="section-subtitle">
              Explore the popular holiday destinations with our expert-curated travel packages
            </p>
          </div>
        </AnimatedElement>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "20px" }}>Discovering amazing destinations...</p>
          </div>
        ) : (
          <>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="destination-section">
                <div className="destination-section-header">
                  <h3 className="destination-section-title">Domestic Holiday Destinations - India Tours</h3>
                </div>

                <div className="destinations-grid">
                  {domesticDestinations.map((destination, index) => (
                    <DestinationCard key={`${destination._id}-${index}`} destination={destination} />
                  ))}
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="destination-section">
                <div className="destination-section-header">
                  <h3 className="destination-section-title">International Holiday Destinations - World Tours</h3>
                </div>

                <div className="destinations-grid">
                  {internationalDestinations.map((destination, index) => (
                    <DestinationCard key={`${destination._id}-${index}`} destination={destination} />
                  ))}
                </div>
              </div>
            </AnimatedElement>
          </>
        )}
      </div>
    </section>
  )
}

export default PopularDestinations
