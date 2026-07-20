import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCachedSettings, setCachedSettings } from "../utils/dataCache";
import { getImageUrl, apiEndpoints } from "../config/api";

const navStyles = `
  .navbar { background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; padding: 10px 0; transition: all 0.3s ease; height: 90px; }
  .navbar.scrolled { padding: 5px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); height: 75px; }
  .navbar.scrolled .nav-brand { height: 60px; }
  .navbar-container { display: flex; justify-content: space-between; align-items: center; height: 100%; padding-left: 15px; padding-right: 15px; }
  .nav-brand { font-size: 1.5rem; font-weight: 700; height: 70px; display: flex; align-items: center; }
  .nav-brand a { display: flex; align-items: center; height: 100%; text-decoration: none; }
  .brand-logo { height: 45px; width: auto; transition: transform 0.3s ease; pointer-events: none; }
  .nav-brand a:hover .brand-logo { transform: scale(1.05); }
  .nav-menu { display: flex; gap: 30px; height: 100%; align-items: center; }
  .nav-link { color: #333; font-weight: 500; position: relative; padding: 5px 0; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; font-family: inherit; font-size: inherit; }
  .nav-link::before { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #f37121; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .nav-link:hover::before, .nav-link.active::before { transform: scaleX(1); }
  .nav-link:hover, .nav-link.active { color: #f37121; }
  .nav-link i { font-size: 1.1rem; transition: transform 0.3s ease; }
  .nav-link:hover i { transform: translateY(-3px); }
  .nav-toggle { display: none; background: none; border: none; cursor: pointer; width: 40px; height: 40px; margin-right: 10px; position: relative; }
  .hamburger { display: block; width: 25px; height: 3px; margin: 3px auto; background-color: #333; transition: all 0.3s ease; transform-origin: center; }
  .nav-toggle.active .hamburger:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .nav-toggle.active .hamburger:nth-child(2) { opacity: 0; }
  .nav-toggle.active .hamburger:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  @media (max-width: 1200px) { .nav-menu { gap: 25px; } .nav-link { font-size: 0.95rem; } }
  @media (max-width: 992px)  { .nav-menu { gap: 20px; } .brand-logo { height: 40px; } .nav-link { font-size: 0.9rem; } .nav-link i { font-size: 1rem; } }
  @media (max-width: 820px)  { .navbar { height: 75px; } .navbar.scrolled { height: 65px; } .nav-brand { height: 60px; } .navbar.scrolled .nav-brand { height: 50px; } .brand-logo { height: 38px; } .nav-toggle { display: flex; flex-direction: column; justify-content: center; align-items: center; } .nav-menu { position: absolute; top: 100%; left: 0; right: 0; background-color: white; flex-direction: column; padding: 15px; gap: 12px; box-shadow: 0 5px 10px rgba(0,0,0,0.1); display: none; text-align: center; z-index: 1000; height: auto; } .nav-menu.active { display: flex; } .nav-link { justify-content: center; font-size: 0.9rem; padding: 8px 0; } }
  @media (max-width: 576px)  { .navbar { height: 65px; padding: 8px 0; } .navbar.scrolled { height: 55px; padding: 5px 0; } .nav-brand { height: 50px; } .navbar.scrolled .nav-brand { height: 45px; } .brand-logo { height: 35px; } .hamburger { width: 22px; height: 2px; margin: 2px auto; } .nav-toggle.active .hamburger:nth-child(1) { transform: translateY(4px) rotate(45deg); } .nav-toggle.active .hamburger:nth-child(3) { transform: translateY(-4px) rotate(-45deg); } .nav-link { font-size: 0.85rem; } .nav-link i { font-size: 0.9rem; } }
`

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [logoUrl, setLogoUrl] = useState("/assets/logos/Pratham-Tours-Logo.jpg");
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve image URL
  const resolveImageUrl = (image) => {
    return getImageUrl(image);
  };

  useEffect(() => {
    const cachedSettings = getCachedSettings();
    if (cachedSettings && cachedSettings.mainLogo) {
      setLogoUrl(resolveImageUrl(cachedSettings.mainLogo));
      return;
    }

    // Fetch from backend
    fetch(apiEndpoints.settings)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCachedSettings(data.data);
          if (data.data.mainLogo) {
            setLogoUrl(resolveImageUrl(data.data.mainLogo));
          }
        }
      })
      .catch(err => console.error("Error fetching logo:", err));
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }

          // Check which section is currently in view
          const sections = [
            "home",
            "packages",
            "destinations",
            "monthly-destinations",
            "about",
          ];
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 100 && rect.bottom >= 100) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set active section based on location pathname
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("home");
    } else if (location.pathname === "/packages") {
      setActiveSection("packages");
    } else if (location.pathname === "/about") {
      setActiveSection("about");
    } else if (location.pathname === "/contact") {
      setActiveSection("contact");
    } else if (location.pathname.startsWith("/package/")) {
      // Set active section to packages when on package detail page
      setActiveSection("packages");
    } else if (location.pathname.startsWith("/booking/")) {
      // Set active section to packages when on booking page
      setActiveSection("packages");
    } else if (location.pathname.startsWith("/payment/")) {
      // Set active section to packages when on payment page
      setActiveSection("packages");
    } else if (location.pathname === "/terms") {
      // Don't highlight any section for terms page
      setActiveSection("");
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Navigate to section function
  const navigateToSection = (id) => {
    closeMenu();

    // If already on home page, scroll to section
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      // Navigate to home page with section hash
      navigate("/", { state: { scrollToId: id } });
    }
  };

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Navbar height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      <div className="container navbar-container">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <img
              src={logoUrl}
              alt="Pratham Tours Logo"
              className="brand-logo"
            />
          </Link>
        </div>

        <button
          className={`nav-toggle ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => {
              closeMenu();
              if (location.pathname === "/") {
                scrollToSection("home");
              }
            }}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>

          <button
            className={`nav-link ${
              activeSection === "destinations" ? "active" : ""
            }`}
            onClick={() => navigateToSection("destinations")}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Destinations</span>
          </button>

          <button
            className={`nav-link ${
              activeSection === "packages" ? "active" : ""
            }`}
            onClick={() => navigateToSection("packages")}
          >
            <i className="fas fa-box"></i>
            <span>Packages</span>
          </button>

          <Link
            to="/about"
            className={`nav-link ${activeSection === "about" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <i className="fas fa-info-circle"></i>
            <span>About Us</span>
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${
              activeSection === "contact" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            <i className="fas fa-envelope"></i>
            <span>Contact us</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;