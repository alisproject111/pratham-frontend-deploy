import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import AnimatedElement from "../components/AnimatedElement";
import AnimatedSection from "../components/AnimatedSection";
import SEOHead from "../components/SEOHead";
import { apiEndpoints } from "../config/api";

const contactStyles = `
  .contact-page { min-height: 100vh; }
  .contact-hero { height: 50vh; min-height: 300px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; position: relative; overflow: hidden; }
  .contact-hero .container { position: relative; z-index: 2; animation: fadeInUp 1s ease; }
  .contact-hero .page-title { font-size: 3.5rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
  .contact-hero .page-subtitle { font-size: 1.2rem; max-width: 600px; margin: 0 auto; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); }
  .contact-section { padding: 4rem 0; background-color: #f9f9f9; position: relative; }
  .contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 40px; margin-top: 40px; }
  .section-header { text-align: center; margin-bottom: 2rem; }
  .section-title { font-size: 2.5rem; margin-bottom: 0.5rem; color: #333; position: relative; display: inline-block; padding-bottom: 15px; }
  .section-title::after { content: ""; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 80px; height: 3px; background: linear-gradient(90deg, #f37121, #ff6b6b); border-radius: 3px; }
  .section-subtitle { font-size: 1.1rem; color: #666; max-width: 600px; margin: 0 auto; }
  .contact-info { display: flex; flex-direction: column; gap: 20px; }
  .contact-card { background-color: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); border-left: 4px solid transparent; }
  .contact-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(14, 165, 233, 0.15); border-left: 4px solid #f37121; }
  .contact-card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
  .contact-card-header i { font-size: 1.5rem; color: #000 !important; width: 50px; height: 50px; background: rgba(0, 0, 0, 0.05) !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important; }
  .contact-card-header h3 { font-size: 1.3rem; color: #000 !important; margin: 0; font-weight: 600; }
  .contact-card p { color: #000 !important; margin-bottom: 5px; padding-left: 65px; line-height: 1.6; font-weight: 500; }
  .contact-card a { color: #000 !important; text-decoration: none; transition: all 0.3s ease; display: inline-block; font-weight: 500; }
  .contact-card a:hover { color: #f37121 !important; transform: translateX(5px); }
  .contact-form-container { height: fit-content; background-color: #fff; padding: 35px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; }
  .form-message { padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center; font-weight: 500; animation: fadeIn 0.5s ease; }
  .form-message.error { background-color: rgba(220, 53, 69, 0.1); border-left: 4px solid #dc3545; color: #dc3545; }
  .form-message.success { background-color: rgba(40, 167, 69, 0.1); border-left: 4px solid #28a745; color: #28a745; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .form-group { margin-bottom: 20px; position: relative; z-index: 1; }
  .form-group label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; }
  .required-asterisk { color: #f37121; margin-left: 3px; font-size: 1rem; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background-color: #f9f9f9; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #f37121; box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1); background-color: #fff; }
  .error-text { color: #dc3545; font-size: 0.875rem; margin-top: 5px; display: block; animation: shake 0.5s ease; }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
  .submit-button { background: linear-gradient(135deg, #f37121 0%, #ff6b6b 100%); color: #fff; border: none; padding: 16px 28px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.2); position: relative; overflow: hidden; }
  .submit-button:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); }
  .submit-button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
  .submit-button i { font-size: 1.2rem; transition: all 0.3s ease; }
  .submit-button:hover i { transform: translateX(5px); }
  .map-section { padding: 60px 0; background-color: #fff; }
  .map-container { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); height: 450px; border: 5px solid #fff; transition: all 0.3s ease; }
  .map-container:hover { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); transform: translateY(-10px); }
  @media (max-width: 992px) { .contact-grid { grid-template-columns: 1fr; } .contact-hero .page-title { font-size: 2.2rem; } }
  @media (max-width: 768px) { .contact-hero { height: 40vh; min-height: 250px; } .contact-hero .page-title { font-size: 1.8rem; } .contact-hero .page-subtitle { font-size: 1rem; } .contact-section { padding: 40px 0; } .section-title { font-size: 1.8rem; } .section-subtitle { font-size: 0.9rem; } .contact-card { padding: 20px; } .contact-card-header i { width: 40px; height: 40px; font-size: 1.2rem; } .contact-card-header h3 { font-size: 1.1rem; } .contact-card p { font-size: 0.9rem; padding-left: 55px; } .contact-form-container { padding: 25px; } .form-row { grid-template-columns: 1fr; gap: 15px; margin-bottom: 15px; } .form-group { margin-bottom: 15px; } .form-group label { font-size: 0.9rem; } .form-group input, .form-group textarea { padding: 12px 15px; font-size: 0.9rem; } .submit-button { padding: 14px 24px; font-size: 1rem; } .map-section { padding: 40px 0; } .map-container { height: 350px; } }
  @media (max-width: 576px) { .contact-hero { height: 35vh; min-height: 200px; } .contact-hero .page-title { font-size: 1.5rem; } .contact-hero .page-subtitle { font-size: 0.9rem; } .contact-card, .contact-form-container { max-width: 450px; margin: 0 auto; width: 100%; } .contact-card { padding: 15px; } .contact-card-header i { width: 35px; height: 35px; font-size: 1rem; } .contact-card p { padding-left: 50px; font-size: 0.85rem; } .contact-form-container { padding: 20px; } .form-group label { font-size: 0.85rem; } .form-group input, .form-group textarea { padding: 10px 12px; font-size: 0.85rem; } .submit-button { padding: 12px 20px; font-size: 0.9rem; } .map-container { height: 300px; max-width: 450px; margin: 0 auto; width: 100%; } }
  @media (max-width: 375px) { .contact-hero .page-title { font-size: 1.3rem; } .contact-hero .page-subtitle { font-size: 0.8rem; } .contact-card, .contact-form-container, .map-container { max-width: 96%; } .map-container { height: 240px; border-width: 3px; } .success-popup { padding: 25px 15px; } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .success-popup-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease; }
  .success-popup { background-color: white; border-radius: 12px; padding: 40px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); position: relative; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .success-popup h3 { font-size: 1.5rem; color: #333; margin-bottom: 15px; }
  .success-popup p { color: #666; margin-bottom: 0; }
  .close-popup-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #999; font-size: 1.2rem; cursor: pointer; transition: color 0.3s ease; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
  .close-popup-btn:hover { color: #f37121; background-color: #f5f5f5; }
  .checkmark-circle-container { position: relative; width: 100px; height: 100px; margin: 0 auto 20px; }
  .checkmark-circle-bg { position: absolute; width: 100px; height: 100px; border-radius: 50%; background-color: #f8f8f8; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .checkmark-circle { position: absolute; top: 0; left: 0; width: 100px; height: 100px; border-radius: 50%; stroke-width: 5; stroke: #4bb71b; stroke-miterlimit: 10; stroke-dasharray: 314; stroke-dashoffset: 314; fill: none; animation: circle-draw 1s ease-in-out forwards; }
  .checkmark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; stroke-width: 5; stroke: #4bb71b; stroke-miterlimit: 10; stroke-dasharray: 100; stroke-dashoffset: 100; fill: none; animation: checkmark-draw 0.5s ease-in-out 1s forwards; }
  .success-circle-fill { position: absolute; top: 0; left: 0; width: 100px; height: 100px; border-radius: 50%; background-color: rgba(75, 183, 27, 0); animation: circle-fill 0.5s ease-in-out 1.5s forwards; }
  @keyframes circle-draw { 0% { stroke-dashoffset: 314; } 100% { stroke-dashoffset: 0; } }
  @keyframes checkmark-draw { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
  @keyframes circle-fill { 0% { background-color: rgba(75, 183, 27, 0); } 100% { background-color: rgba(75, 183, 27, 0.2); } }
  @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @media (max-width: 576px) { .success-popup { padding: 30px 20px; } .checkmark-circle-container, .checkmark-circle-bg, .checkmark-circle, .success-circle-fill { width: 80px; height: 80px; } .checkmark { width: 40px; height: 40px; } .success-popup h3 { font-size: 1.3rem; } .success-popup p { font-size: 0.9rem; } }
`

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    success: false,
    message: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(apiEndpoints.settings)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.data);
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.trim().length < 3) errors.name = "Name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Email is required";
    
    // Clean spaces, hyphens, and +91 prefix from phone number for validation
    const cleanPhone = formData.phone?.replace(/[\s-+]/g, '').replace(/^91/, '');
    if (!cleanPhone || !/^\d{10}$/.test(cleanPhone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    
    if (!formData.subject) errors.subject = "Subject is required";
    if (!formData.message || formData.message.trim().length < 10) errors.message = "Message must be at least 10 characters ";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (formErrors[name]) setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormStatus({ submitted: true, submitting: false, success: false, message: "Please fill all the required fields." });
      return;
    }

    setFormStatus({ submitted: true, submitting: true, success: false, message: "Sending your message..." });

    try {
      const response = await fetch(apiEndpoints.contact, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus({ submitted: true, submitting: false, success: true, message: "Thank you for your message! We will get back to you soon." });
        setShowSuccessPopup(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setFormErrors({});
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      setFormStatus({ submitted: true, submitting: false, success: false, message: "An error occurred. Please try again later." });
    }
  };

  const closeSuccessPopup = () => setShowSuccessPopup(false);

  useEffect(() => {
    let timer, interval;
    if (showSuccessPopup) {
      setCountdown(5);
      timer = setTimeout(() => setShowSuccessPopup(false), 5000);
      interval = setInterval(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [showSuccessPopup]);

  // Map effect removed in favor of direct iframe

  return (
    <div className="contact-page">
      <style dangerouslySetInnerHTML={{ __html: contactStyles }} />
      <Helmet>
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
      </Helmet>
      <SEOHead
        title="Contact Us | Pratham Tours - Best Travel & Holiday Agency"
        description="Contact Pratham Tours for best travel packages. Located in Vadodara, Gujarat. Call 096870 61413 or email contact.us.pratham-tours@gmail.com. Get expert travel advice & book your dream vacation."
        keywords="contact Pratham Tours, travel agency Vadodara, tour booking, travel consultation, holiday planning, travel agent contact, Gujarat travel agency"
        canonical="https://prathamtours.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Pratham Tours",
          description: "Contact information for Pratham Tours travel agency",
          url: "https://prathamtours.com/contact",
        }}
      />
      <div className="contact-hero" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/contact/contact-hero.webp)' }}>
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="page-title">Contact Us</h1>
            <p className="page-subtitle">We'd love to hear from you</p>
          </AnimatedElement>
        </div>
      </div>

      <section className="contact-section section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-subtitle">Our team is here to help you with any questions</p>
            </div>
          </AnimatedElement>

          <div className="contact-grid">
            <AnimatedSection staggered={true} staggerDelay={150} className="contact-info">
              <div className="contact-card">
                <div className="contact-card-header">
                  <i className="fas fa-map-marker-alt"></i>
                  <h3>Our Location</h3>
                </div>
                <p>
                  <a href={settings?.mapLink || "https://www.google.com/maps/dir//Pratham+Tour,+428-429+Trivia+Complex+Racecourse,+Vadodara,+Gujarat+390007/@22.3084544,73.1676672,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x395fc8bd66030183:0x1e22c9bd714c84d!2m2!1d73.159288!2d22.309767?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                    {settings?.address || "428-429 Trivia Complex Racecourse, Vadodara, Gujarat 390007"}
                  </a>
                </p>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <i className="fas fa-phone"></i>
                  <h3>Phone Number</h3>
                </div>
                 {settings?.phone ? (
                  <p><a href={'tel:' + settings.phone}>{settings.phone}</a></p>
                ) : (
                  <p><a href="tel:+919687061413">+91 96870 61413</a></p>
                )}
                {settings?.whatsapp ? (
                  <p><a href={'https://wa.me/' + settings.whatsapp.replace(/[^0-9]/g, '')}>{settings.whatsapp}</a></p>
                ) : (
                  <p><a href="tel:+918928289283">+91 89282 89283</a></p>
                )}
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <i className="fas fa-envelope"></i>
                  <h3>Email Address</h3>
                </div>
                {settings?.email ? (
                   <p><a href={'mailto:' + settings.email}>{settings.email}</a></p>
                ) : (
                   <p><a href="mailto:contact.us.pratham-tours@gmail.com">contact.us.pratham-tours@gmail.com</a></p>
                )}
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <i className="fas fa-clock"></i>
                  <h3>Working Hours</h3>
                </div>
                {settings?.workingHours ? (
                  settings.workingHours.split('\\n').map((line, i) => <p key={i}>{line}</p>)
                ) : (
                  <>
                    <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </>
                )}
              </div>
            </AnimatedSection>

            <AnimatedElement animation="fade-left" className="contact-form-container">
              {formStatus.submitted && (
                <div className={'form-message ' + (formStatus.success ? "success" : "error")}>
                  {formStatus.message}
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name <span className="required-asterisk">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Your Email <span className="required-asterisk">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number <span className="required-asterisk">*</span></label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>
                  <div className="form-group relative" ref={dropdownRef} style={{ zIndex: isDropdownOpen ? 50 : 1 }}>
                    <label htmlFor="subject">Subject <span className="required-asterisk">*</span></label>
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full border-2 border-slate-200 rounded-lg bg-slate-50 font-medium text-sm px-[18px] flex justify-between items-center cursor-pointer transition-all hover:border-orange-500 focus:border-orange-500"
                      style={{ height: '52px' }}
                    >
                      <span className={formData.subject ? "text-slate-800" : "text-slate-500"}>
                        {formData.subject || "Select a package category..."}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                        {[
                          "Domestic Tour Package Booking",
                          "International Tour Package Booking",
                          "Custom Tour Planning (Tailor-made)",
                          "Group Tour Package",
                          "Corporate / Business Tour Package",
                          "Honeymoon Holiday Package"
                        ].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, subject: opt }));
                              setIsDropdownOpen(false);
                              if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: undefined }));
                            }}
                            className="px-[18px] py-3 text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-semibold cursor-pointer transition-colors text-sm text-left"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {formErrors.subject && <span className="error-text">{formErrors.subject}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message <span className="required-asterisk">*</span></label>
                  <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange}></textarea>
                  {formErrors.message && <span className="error-text">{formErrors.message}</span>}
                </div>
                <button type="submit" className="submit-button" disabled={formStatus.submitting}>
                  <span>{formStatus.submitting ? "Sending..." : "Send Message"}</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Find Us</h2>
              <p className="section-subtitle">Visit our office or contact us online</p>
            </div>
          </AnimatedElement>
          <AnimatedElement animation="zoom-in" delay={300}>
            <div className="map-container" style={{ position: "relative", height: "450px", width: "100%" }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.0776510425714!2d73.159288!3d22.309767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8bd66030183%3A0x1e22c9bd714c84d!2sPratham%20Tour!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Pratham Tours Location"
              ></iframe>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="checkmark-circle-container">
              <div className="checkmark-circle-bg"></div>
              <svg className="checkmark-circle" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" /></svg>
              <svg className="checkmark" viewBox="0 0 50 50"><path d="M14,27 L22,35 L36,15" /></svg>
              <div className="success-circle-fill"></div>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We will get back to you soon.</p>
            <div style={{ margin: "16px 0", width: "100%" }}>
              <div style={{ height: "6px", width: "100%", background: "#eee", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ height: "100%", width: (((5 - countdown) / 5) * 100) + "%", background: "#4caf50", transition: "width 1s linear" }}></div>
              </div>
              <div style={{ textAlign: "right", fontSize: "12px", color: "#666" }}>
                Closing in {countdown} second{countdown !== 1 ? "s" : ""}
              </div>
            </div>
            <button className="close-popup-btn" onClick={closeSuccessPopup}><i className="fas fa-times"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;