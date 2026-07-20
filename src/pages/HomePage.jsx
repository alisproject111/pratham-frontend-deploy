import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import PopularPackages from "../components/PopularPackages";
import PopularDestinations from "../components/PopularDestinations";
import TopDestinations from "../components/TopDestinations";
import MonthlyDestinations from "../components/MonthlyPackages";
import OffersSection from "../components/OffersSection";
import WhyChooseUs from "../components/WhyChooseUs";
import HappyCustomers from "../components/HappyCustomers";
import Testimonials from "../components/Testimonials";
import AnimatedElement from "../components/AnimatedElement";
import CustomizePackageButton from "../components/CustomizePackageButton";
import SEOHead from "../components/SEOHead";
import { apiEndpoints } from "../config/api";



function HomePage() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [loadRemaining, setLoadRemaining] = useState(false);
  const [loadMonthlyDestinations, setLoadMonthlyDestinations] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(apiEndpoints.settings)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        } else {
          setSettings({});
        }
      })
      .catch(err => {
        console.error("Error fetching settings:", err);
        setSettings({});
      });
  }, []);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show search bar when user scrolls past 50px
      setShowSearchBar(window.scrollY > 50);
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // If we have a state indicating a scroll target, trigger loading immediately
    if (location.state && location.state.scrollToId) {
      setLoadRemaining(true);
      setLoadMonthlyDestinations(true);
      return;
    }

    const loadDeferred = () => {
      setLoadRemaining(true);
      setLoadMonthlyDestinations(true);
    };

    // Load after 1 second or on scroll (whichever comes first)
    const timer = setTimeout(loadDeferred, 1000);

    const handleScroll = () => {
      loadDeferred();
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.state]);

  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.state && location.state.scrollToId) {
      const id = location.state.scrollToId;
      const element = document.getElementById(id);

      if (element) {
        // Wait for page to fully load before scrolling
        setTimeout(() => {
          const yOffset = -80; // Navbar height offset
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.state]);

  // For mobile, don't use animations
  if (isMobile) {
    return (
      <div className="home-page">
        <style dangerouslySetInnerHTML={{ __html: `
          .home-page {
            min-height: 100vh;
          }
          .search-bar-wrapper {
            position: relative;
            z-index: 20;
            margin-top: -120px;
          }
          @media (max-width: 768px) {
            .search-bar-wrapper {
              margin-top: -80px;
            }
          }
        ` }} />
        <SEOHead
          title="Pratham Tours - Best Travel & Holiday Packages | Domestic & International Tours"
          description="Discover amazing travel packages with Pratham Tours. Book affordable domestic & international tours to Goa, Kerala, Manali, Bali, Thailand, Vietnam & more destinations. Best prices guaranteed with 24/7 support."
          keywords="travel packages, holiday packages, tour packages, vacation packages, domestic tours, international tours, India travel, Goa packages, Kerala tours, Manali trips, Bali tours, Thailand packages, Vietnam tours, affordable travel, best travel deals, holiday booking, travel agency India, family vacation packages, honeymoon packages, adventure tours"
          canonical="https://prathamtours.com/"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Pratham Tours",
            description:
              "Best travel agency offering domestic and international tour packages",
            url: "https://prathamtours.com",
            logo: "https://prathamtours.com/pratham-tours-logo.png",
            image: "https://prathamtours.com/pratham-tours-logo.png",
            telephone: ["+91-9687061413", "+91-8928289283"],
            email: "contact.us.pratham-tours@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "428-429 Trivia Complex Racecourse",
              addressLocality: "Vadodara",
              addressRegion: "Gujarat",
              postalCode: "390007",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "22.3072",
              longitude: "73.1812",
            },
            openingHours: "Mo-Sa 10:00-19:00",
            priceRange: "₹₹",
            serviceArea: {
              "@type": "Country",
              name: "India",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Travel Packages",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "TouristTrip",
                    name: "Domestic Tour Packages",
                    description: "Explore beautiful destinations within India",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "TouristTrip",
                    name: "International Tour Packages",
                    description: "Discover amazing international destinations",
                  },
                },
              ],
            },
          }}
        />
        <div id="home" style={{ backgroundColor: '#fff' }}>
          <HeroSection settings={settings} />
          <div className="search-bar-wrapper">
            <div
              style={{
                opacity: showSearchBar ? 1 : 0,
                transform: showSearchBar ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: showSearchBar ? 'auto' : 'none'
              }}
            >
              <SearchBar />
            </div>
          </div>
        </div>

        <OffersSection settings={settings} />

        <TopDestinations />

        <div id="packages">
          <PopularPackages settings={settings} />
        </div>

        <WhyChooseUs settings={settings} />
        <Testimonials settings={settings} />
        <HappyCustomers settings={settings} />

        <div id="monthly-destinations">
          {loadMonthlyDestinations && (
            <MonthlyDestinations />
          )}
        </div>
        <CustomizePackageButton />
      </div>
    );
  }

  // For desktop, use animations
  return (
    <div className="home-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .home-page {
          min-height: 100vh;
        }
        .search-bar-wrapper {
          position: relative;
          z-index: 20;
          margin-top: -120px;
        }
        @media (max-width: 768px) {
          .search-bar-wrapper {
            margin-top: -80px;
          }
        }
      ` }} />
      <SEOHead
        title="Pratham Tours - Best Travel & Holiday Packages | Domestic & International Tours"
        description="Discover amazing travel packages with Pratham Tours. Book affordable domestic & international tours to Goa, Kerala, Manali, Bali, Thailand, Vietnam & more destinations. Best prices guaranteed with 24/7 support."
        keywords="travel packages, holiday packages, tour packages, vacation packages, domestic tours, international tours, India travel, Goa packages, Kerala tours, Manali trips, Bali tours, Thailand packages, Vietnam tours, affordable travel, best travel deals, holiday booking, travel agency India, family vacation packages, honeymoon packages, adventure tours"
        canonical="https://prathamtours.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Pratham Tours",
          description:
            "Best travel agency offering domestic and international tour packages",
          url: "https://prathamtours.com",
          logo: "https://prathamtours.com/pratham-tours-logo.png",
          image: "https://prathamtours.com/pratham-tours-logo.png",
          telephone: ["+91-9687061413", "+91-8928289283"],
          email: "contact.us.pratham-tours@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "428-429 Trivia Complex Racecourse",
            addressLocality: "Vadodara",
            addressRegion: "Gujarat",
            postalCode: "390007",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "22.3072",
            longitude: "73.1812",
          },
          openingHours: "Mo-Sa 10:00-19:00",
          priceRange: "₹₹",
          serviceArea: {
            "@type": "Country",
            name: "India",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Travel Packages",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "TouristTrip",
                  name: "Domestic Tour Packages",
                  description: "Explore beautiful destinations within India",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "TouristTrip",
                  name: "International Tour Packages",
                  description: "Discover amazing international destinations",
                },
              },
            ],
          },
        }}
      />
      <div id="home" style={{ backgroundColor: '#fff' }}>
        <HeroSection settings={settings} />
        <div className="search-bar-wrapper">
          <div 
            style={{ 
              opacity: showSearchBar ? 1 : 0, 
              transform: showSearchBar ? 'translateY(0)' : 'translateY(40px)', 
              transition: 'all 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: showSearchBar ? 'auto' : 'none'
            }}
          >
            <SearchBar />
          </div>
        </div>
      </div>

      <OffersSection settings={settings} />

      <TopDestinations />
      <div id="packages">
        <PopularPackages settings={settings} />
      </div>

      <WhyChooseUs settings={settings} />
      <Testimonials settings={settings} />
      <HappyCustomers settings={settings} />

      <div id="monthly-destinations">
        {loadMonthlyDestinations && (
          <MonthlyDestinations />
        )}
      </div>
      <CustomizePackageButton />
    </div>
  );
}

export default HomePage;
