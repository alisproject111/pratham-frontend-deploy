import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { useToast } from "./components/Toast";
import GlobalMapIframe from "./components/GlobalMapIframe";

// ADD THIS LINE: Import Toastify CSS BEFORE your custom CSS
import "react-toastify/dist/ReactToastify.css";

const appStyles = `
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .lazy-image { transition: opacity 0.3s ease-in-out; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  .main-content { flex: 1; will-change: auto; }
  .loading-spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #ff6b6b; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .loading-container { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; gap: 20px; }
  .loading-container p { color: #666; font-size: 16px; }
  .location-icon::before { content: "📍"; margin-right: 5px; }
  .calendar-icon::before { content: "📅"; margin-right: 5px; }
  .group-icon::before { content: "👥"; margin-right: 5px; }
  .check-icon::before { content: "✓"; margin-right: 5px; color: #ff6b6b; }
  .phone-icon::before { content: "📞"; margin-right: 5px; }
  .email-icon::before { content: "✉️"; margin-right: 5px; }
  .hours-icon::before { content: "🕒"; margin-right: 5px; }
  .social-icon { display: inline-block; width: 40px; height: 40px; background-color: #f8f9fa; border-radius: 50%; text-align: center; line-height: 40px; margin-right: 10px; transition: all 0.3s ease; }
  .social-icon:hover { background-color: #ff6b6b; color: white; }
  .facebook::before { content: "f"; font-weight: bold; }
  .twitter::before { content: "t"; font-weight: bold; }
  .instagram::before { content: "i"; font-weight: bold; }
  .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; text-align: center; padding: 20px; }
  .loading-spinner { width: 60px; height: 60px; border: 4px solid rgba(14, 165, 233, 0.1); border-radius: 50%; border-top: 4px solid #f37121; position: relative; animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; margin-bottom: 20px; box-shadow: 0 0 15px rgba(14, 165, 233, 0.2); }
  .loading-spinner::before { content: ""; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border-radius: 50%; border: 1px solid rgba(14, 165, 233, 0.1); animation: pulse 1.5s ease-out infinite; }
  .loading-spinner::after { content: ""; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40%; height: 40%; border-radius: 50%; background: rgba(14, 165, 233, 0.05); animation: glow 1.5s ease-in-out infinite alternate; }
  @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
  @keyframes glow { 0% { opacity: 0.2; } 100% { opacity: 0.8; } }
  .loading-container p { font-size: 1.1rem; color: #333; margin-top: 10px; animation: fadeInOut 1.5s ease-in-out infinite; font-weight: 500; letter-spacing: 0.5px; }
  @keyframes fadeInOut { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .error-container { text-align: center; padding: 60px 20px; }
  .back-button { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #ff6b6b; color: white; border-radius: 4px; transition: all 0.3s ease; }
  .back-button:hover { background-color: #ff5252; }
  .page-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; color: white; }
  .page-subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); }
  @media (max-width: 768px) { .container { padding: 0 10px; } .section { padding: 40px 0; } .section-title { font-size: 1.75rem; } .section-subtitle { font-size: 0.9rem; } .loading-container { height: 200px; } .loading-spinner { width: 50px; height: 50px; } }
  @media (max-width: 576px) { .section-title { font-size: 1.5rem; } .btn { padding: 10px 20px; font-size: 0.9rem; } }
`

// Lazy load pages for better performance
const PackagesPage = lazy(() => import("./pages/PackagesPage"));
const PackageDetailPage = lazy(() => import("./pages/PackageDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PaymentStatus = lazy(() => import("./pages/PaymentStatusPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("./pages/terms-and-conditions"));
const RefundPolicy = lazy(() => import("./pages/refund-policy"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SocialMediaComingSoon = lazy(() => import("./pages/SocialMediaComingSoon"));

// ScrollToTop component to handle scrolling on route change
function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if we're navigating to home page and if we came from a package detail page
    const previousPath = sessionStorage.getItem("previousPath");

    if (
      pathname === "/" &&
      previousPath &&
      previousPath.startsWith("/package/")
    ) {
      // If returning to home from package detail, scroll to popular packages section
      setTimeout(() => {
        const popularPackagesSection =
          document.querySelector(".popular-packages");
        if (popularPackagesSection) {
          popularPackagesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure the component is rendered
    } else {
      // For all other navigation, scroll to top
      window.scrollTo(0, 0);
    }

    // Store current path for next navigation
    sessionStorage.setItem("previousPath", pathname);
  }, [pathname]);

  return null;
}

// Component to render global layout with navbar and footer
function ConditionalLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function App() {
  const { ToastContainer } = useToast();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTopOnNavigation />
      <div className="app">
        <style dangerouslySetInnerHTML={{ __html: appStyles }} />
        <ConditionalLayout>
          <Suspense
            fallback={
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            }
          >
            <Helmet>
              <link rel="icon" href="/pratham-tours-logo.png" />
              <link rel="apple-touch-icon" href="/pratham-tours-logo.png" />
            </Helmet>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/package/:id" element={<PackageDetailPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/social-media-coming-soon" element={<SocialMediaComingSoon />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ConditionalLayout>

        {/* Global Map Iframe - Persistent Caching */}
        <GlobalMapIframe />

        {/* Toast Container - Global */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;