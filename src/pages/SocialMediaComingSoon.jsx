import { useLocation, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SEOHead from "../components/SEOHead"

const socialStyles = `
  .coming-soon-container { display: flex; align-items: center; justify-content: center; min-height: 80vh; padding: 40px 20px; background: radial-gradient(circle at 10% 20%, rgba(26, 32, 44, 0.95) 0%, rgba(15, 17, 23, 1) 90%); color: #ffffff; overflow: hidden; position: relative; font-family: 'Outfit', 'Inter', sans-serif; }
  .coming-soon-container::before, .coming-soon-container::after { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; filter: blur(120px); z-index: 1; opacity: 0.15; pointer-events: none; transition: all 0.8s ease; }
  .coming-soon-container.facebook::before { background: #1877f2; top: 10%; left: 10%; }
  .coming-soon-container.facebook::after { background: #0d8bf0; bottom: 10%; right: 10%; }
  .coming-soon-container.instagram::before { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); top: 10%; left: 10%; }
  .coming-soon-container.instagram::after { background: linear-gradient(45deg, #cc2366 0%, #dc2743 50%, #e6683c 100%); bottom: 10%; right: 10%; }
  .coming-soon-card { position: relative; z-index: 10; max-width: 600px; width: 100%; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 50px 40px; text-align: center; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.5s ease; }
  .coming-soon-card:hover { transform: translateY(-5px); }
  .coming-soon-container.facebook .coming-soon-card { border-color: rgba(24, 119, 242, 0.3); box-shadow: 0 20px 50px rgba(24, 119, 242, 0.15); }
  .coming-soon-container.instagram .coming-soon-card { border-color: rgba(220, 39, 67, 0.3); box-shadow: 0 20px 50px rgba(220, 39, 67, 0.15); }
  .platform-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); }
  .coming-soon-container.facebook .platform-badge { color: #1877f2; border-color: rgba(24, 119, 242, 0.3); background: rgba(24, 119, 242, 0.1); }
  .coming-soon-container.instagram .platform-badge { color: #e1306c; border-color: rgba(225, 48, 108, 0.3); background: rgba(225, 48, 108, 0.1); }
  .icon-container { display: flex; align-items: center; justify-content: center; margin: 0 auto 30px auto; width: 100px; height: 100px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); font-size: 3rem; transition: all 0.5s ease; position: relative; }
  .icon-container::after { content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; border-radius: 50%; border: 1px dashed rgba(255, 255, 255, 0.2); animation: spin 20s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .coming-soon-container.facebook .icon-container { color: #1877f2; background: rgba(24, 119, 242, 0.05); box-shadow: 0 0 30px rgba(24, 119, 242, 0.2); }
  .coming-soon-container.instagram .icon-container { color: #ffffff; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); box-shadow: 0 0 30px rgba(220, 39, 67, 0.3); border: none; }
  .coming-soon-card:hover .icon-container { transform: scale(1.1) rotate(15deg); }
  .coming-soon-card h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; line-height: 1.25; }
  .coming-soon-container.facebook h1 { background: linear-gradient(120deg, #ffffff, #8abaff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .coming-soon-container.instagram h1 { background: linear-gradient(120deg, #ffffff, #ffd2e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .coming-soon-card p.subtitle { font-size: 1.1rem; color: #a0aec0; line-height: 1.6; margin-bottom: 30px; max-width: 480px; margin-left: auto; margin-right: auto; }
  .coming-soon-actions { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
  .action-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 50px; font-weight: 600; text-decoration: none; transition: all 0.3s ease; font-size: 1rem; }
  .coming-soon-container.facebook .action-btn-primary { background: linear-gradient(135deg, #1877f2 0%, #0d8bf0 100%); color: white; }
  .coming-soon-container.facebook .action-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(24, 119, 242, 0.3); }
  .coming-soon-container.instagram .action-btn-primary { background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%); color: white; }
  .coming-soon-container.instagram .action-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(220, 39, 67, 0.3); }
  .action-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #e2e8f0; font-weight: 600; text-decoration: none; transition: all 0.3s ease; font-size: 1rem; cursor: pointer; }
  .action-btn-secondary:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); color: #ffffff; transform: translateY(-2px); }
  @media (max-width: 576px) { .coming-soon-card { padding: 35px 20px; } .coming-soon-card h1 { font-size: 1.8rem; } .coming-soon-actions { flex-direction: column; width: 100%; } .action-btn-primary, .action-btn-secondary { width: 100%; justify-content: center; } }
`

function SocialMediaComingSoon() {
  const location = useLocation()
  const navigate = useNavigate()
  const [platform, setPlatform] = useState("facebook")

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const p = params.get("platform") || "facebook"
    setPlatform(p.toLowerCase())
  }, [location.search])

  const getPlatformDetails = () => {
    switch (platform) {
      case "instagram":
        return {
          name: "Instagram",
          icon: "fab fa-instagram",
          colorClass: "instagram",
          accentColor: "#e1306c",
        }
      case "facebook":
      default:
        return {
          name: "Facebook",
          icon: "fab fa-facebook-f",
          colorClass: "facebook",
          accentColor: "#1877f2",
        }
    }
  }

  const details = getPlatformDetails()

  return (
    <div className={`coming-soon-container ${details.colorClass}`}>
      <style dangerouslySetInnerHTML={{ __html: socialStyles }} />
      <SEOHead
        title={`${details.name} Coming Soon | Pratham Tours`}
        description={`We are building an interactive ${details.name} integration. Discover more exciting features coming soon!`}
        keywords={`pratham-tours ${details.name}, travel agency, coming soon, interactive trip planning`}
        canonical={`https://prathamtours.com/social-media-coming-soon?platform=${platform}`}
      />

      <div className="coming-soon-card">
        <div className="platform-badge">
          <i className={details.icon}></i>
          <span>{details.name} Channel</span>
        </div>

        <div className="icon-container">
          <i className={details.icon}></i>
        </div>

        <h1>Under Construction</h1>
        <p className="subtitle">
          We are working to create something like this in an interactive way for our{" "}
          <strong>{details.name}</strong> page! Stay tuned for a highly tailored social experience.
        </p>

        <div className="coming-soon-actions">
          <Link to="/packages" className="action-btn-primary">
            <i className="fas fa-compass"></i> Explore Packages
          </Link>
          <button onClick={() => navigate(-1)} className="action-btn-secondary">
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaComingSoon
