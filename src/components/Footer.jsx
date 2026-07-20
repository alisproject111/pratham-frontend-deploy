import { Link } from "react-router-dom";
import { useEffect } from "react";

const footerStyles = `
  .footer { background-color: #222; color: #fff; position: relative; overflow: hidden; }
  .footer-top-bar { background-color: #fff; border-top: 1px solid #eaeaea; padding: 30px 0; margin-bottom: 0; position: relative; z-index: 2; }
  .footer-top-container { display: grid; grid-template-columns: repeat(5,1fr); gap: 20px; align-items: start; max-width: 1600px; margin: 0 auto; padding: 0 5%; }
  .top-bar-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
  .top-bar-icon-text { display: flex; align-items: center; gap: 8px; color: #666; font-size: 0.9rem; white-space: nowrap; }
  .top-bar-icon-text i { font-size: 1.1rem; }
  .top-bar-link { color: #111; font-weight: 700; font-size: 0.85rem; text-decoration: none; transition: all 0.3s ease; white-space: nowrap; }
  .top-bar-link:hover { color: #f37121; }
  .top-bar-socials { display: flex; gap: 12px; margin-top: 2px; }
  .top-social-link { width: 32px; height: 32px; background-color: #111; color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.9rem; text-decoration: none; transition: all 0.3s ease; }
  .top-social-link:hover { background-color: #f37121; transform: translateY(-3px); }
  .footer-container { padding-top: 60px; position: relative; z-index: 1; display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 30px; }
  .footer-section h3 { color: #fff; font-size: 1.2rem; margin-bottom: 20px; position: relative; padding-bottom: 10px; }
  .footer-section h3::after { content: ""; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background-color: #f37121; }
  .footer-section p { color: #ccc; margin-bottom: 20px; line-height: 1.6; }
  .social-links { display: flex; gap: 15px; }
  .social-link { width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; transition: all 0.3s ease; }
  .social-link:hover { background-color: #f37121; transform: translateY(-3px); }
  .footer-links li { margin-bottom: 12px; }
  .footer-links a { color: #ccc; transition: color 0.3s ease; display: inline-flex; align-items: center; gap: 10px; }
  .footer-icon { color: #f37121; font-size: 0.9rem; }
  .footer-links a:hover { color: #f37121; }
  .contact-info p { margin-bottom: 15px; display: flex; align-items: flex-start; gap: 15px; color: #ccc; }
  .contact-info a { color: #ccc; text-decoration: none; transition: color 0.3s ease; display: inline-flex; align-items: center; gap: 15px; }
  .contact-info a:hover { color: #f37121; }
  .contact-info i { color: #f37121; font-size: 1.1rem; margin-top: 3px; }
  .footer-section { overflow: visible; }
  .footer-section > div { animation: none; }
  .footer-bottom { position: relative; z-index: 1; background-color: #111; padding: 20px 0; margin-top: 40px; }
  .footer-bottom-container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
  .footer-bottom p { color: #bbb; margin: 0; }
  .footer-policies { display: flex; gap: 15px; flex-wrap: wrap; align-items: center; }
  .footer-policy-link { color: #bbb; font-size: 0.9rem; transition: color 0.3s ease; display: inline-block; text-decoration: none; }
  .footer-policy-link:not(:last-child) { border-right: 1px solid #444; padding-right: 15px; }
  .footer-policy-link:hover { color: #f37121; }
  @media (max-width: 992px) { .footer-top-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; } .top-bar-item { align-items: center; text-align: center; width: 45%; } .footer-container { grid-template-columns: repeat(2,1fr); gap: 25px; } }
  @media (max-width: 768px) { .top-bar-item { width: 100%; } .footer { padding-top: 40px; } .footer-container { grid-template-columns: 1fr; gap: 20px; } .footer-section h3 { font-size: 1.1rem; margin-bottom: 15px; } .footer-section p { font-size: 0.9rem; } .footer-links li { margin-bottom: 10px; } .footer-links a,.contact-info a,.contact-info p { font-size: 0.9rem; } .social-link { width: 36px; height: 36px; } .footer-bottom { margin-top: 30px; padding: 15px 0; } .footer-bottom p { font-size: 0.85rem; } .footer-bottom-container { flex-direction: row; flex-wrap: wrap; justify-content: center; text-align: center; gap: 15px; } .footer-policies { justify-content: center; gap: 12px; } .footer-policy-link { font-size: 0.85rem; } .footer-policy-link:not(:last-child) { padding-right: 12px; } }
  @media (max-width: 576px) { .footer-bottom-container { flex-direction: column; gap: 10px; } .footer-policies { width: 100%; justify-content: center; gap: 8px; } .footer-section h3 { font-size: 1rem; margin-bottom: 12px; } .footer-section p,.footer-links a,.contact-info a,.contact-info p { font-size: 0.8rem; } .social-link { width: 32px; height: 32px; font-size: 0.9rem; } .footer-policy-link { font-size: 0.75rem; } .footer-policy-link:not(:last-child) { padding-right: 8px; } .footer-copyright { font-size: 0.75rem !important; } }
  @media (max-width: 380px) { .footer-bottom-container { flex-direction: column; gap: 10px; } .footer-policies { width: 100%; justify-content: center; gap: 6px; } .footer-section h3 { font-size: 0.95rem; margin-bottom: 10px; } .footer-section p,.footer-links a,.contact-info a,.contact-info p { font-size: 0.75rem; } .footer-policy-link { font-size: 0.7rem; } .footer-policy-link:not(:last-child) { padding-right: 6px; } .footer-copyright { font-size: 0.75rem !important; } }
`

function Footer() {
  const currentYear = new Date().getFullYear();

  // Add useEffect to handle scrolling after navigation
  useEffect(() => {
    // Check if we need to scroll to a section after navigation
    const sectionToScroll = sessionStorage.getItem("scrollToSection");
    if (sectionToScroll) {
      // Clear the stored section
      sessionStorage.removeItem("scrollToSection");

      // Wait for the page to fully load
      setTimeout(() => {
        const element = document.getElementById(sectionToScroll);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      {/* Top Contact Info Bar - Separated from main footer */}
      <section className="footer-top-bar">
        <div className="footer-top-container">
          
          <div className="top-bar-item">
            <div className="top-bar-icon-text">
              <i className="far fa-building"></i>
              <span>Pratham Tours Offices</span>
            </div>
            <a href="/contact" className="top-bar-link">Locate Us</a>
          </div>

          <div className="top-bar-item">
            <div className="top-bar-icon-text">
              <i className="fas fa-phone-alt"></i>
              <span>Request a Quote</span>
            </div>
            <a href="tel:+919687061413" className="top-bar-link">+91 96870 61413</a>
          </div>

          <div className="top-bar-item">
            <div className="top-bar-icon-text">
              <i className="far fa-envelope"></i>
              <span>For Feedback</span>
            </div>
            <a href="mailto:contact.us.pratham-tours@gmail.com" className="top-bar-link">contact.us.pratham-tours@gmail.com</a>
          </div>

          <div className="top-bar-item">
            <div className="top-bar-icon-text">
              <i className="far fa-envelope-open"></i>
              <span>For Enquiries</span>
            </div>
            <a href="mailto:contact.us.pratham-tours@gmail.com" className="top-bar-link">contact.us.pratham-tours@gmail.com</a>
          </div>

          <div className="top-bar-item">
            <div className="top-bar-icon-text">
              <i className="fas fa-share-alt"></i>
              <span>Connect with us</span>
            </div>
            <div className="top-bar-socials">
              <a href="/social-media-coming-soon" className="top-social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="/social-media-coming-soon" className="top-social-link"><i className="fab fa-youtube"></i></a>
              <a href="/social-media-coming-soon" className="top-social-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="/social-media-coming-soon" className="top-social-link"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

        </div>
      </section>

      <footer className="footer">
        <div className="container footer-container">
        <div className="footer-section">
          <h3>TravelPackages</h3>
          <p>
            Discover the world with our premium travel packages. We offer
            unforgettable experiences at affordable prices.
          </p>

        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-home footer-icon"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/packages" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-box footer-icon"></i> Packages
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-info-circle footer-icon"></i> About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-envelope footer-icon"></i> Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Popular Destinations</h3>
          <ul className="footer-links">
            <li>
              <Link
                to={`/package/sikkim-darjeeling-gangtok-lachung`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Sikkim
              </Link>
            </li>
            <li>
              <Link
                to={`/package/vietnam-ha-noi-halong-bay-phu-quoc-da-nang`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Vietnam
              </Link>
            </li>
            <li>
              <Link
                to={`/package/bhutan-thimphu-paro-punakha`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Bhutan
              </Link>
            </li>
            <li>
              <Link
                to={`/package/north-east-tawang-dirang`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> North East
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <address className="contact-info">
            <p>
              <a
                href="https://www.google.com/maps/dir//Pratham+Tour,+428-429+Trivia+Complex+Racecourse,+Vadodara,+Gujarat+390007/@22.3084544,73.1676672,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x395fc8bd66030183:0x1e22c9bd714c84d!2m2!1d73.159288!2d22.309767?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-map-marker-alt"></i> 428-429 Trivia Complex Racecourse, Vadodara, Gujarat 390007
              </a>
            </p>
            <p>
              <a href="tel:+919687061413">
                <i className="fas fa-phone"></i> +91 96870 61413
              </a>
            </p>
            <p>
              <a href="tel:+918928289283">
                <i className="fas fa-phone"></i> +91 89282 89283
              </a>
            </p>
            <p>
              <a href="mailto:contact.us.pratham-tours@gmail.com">
                <i className="fas fa-envelope"></i>{" "}
                contact.us.pratham-tours@gmail.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            &copy; {currentYear} Pratham Tours. All rights reserved.
          </p>
          <div className="footer-policies">
            {/* 
            <Link
              to="/privacy-policy"
              target="_blank"
              className="footer-policy-link"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              target="_blank"
              className="footer-policy-link"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/refund-policy"
              target="_blank"
              className="footer-policy-link"
            >
              Refund Policy
            </Link>
            */}
          </div>
        </div>
      </div>
    </footer>
  </>
);
}

export default Footer;
