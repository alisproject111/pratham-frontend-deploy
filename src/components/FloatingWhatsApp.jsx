import { useState, useEffect } from "react";
import { CONTACT_INFO } from "../config/constants";

const styles = `
  .floating-whatsapp-button { position: fixed; right: 30px; bottom: 30px; width: 60px; height: 60px; border-radius: 50%; background-color: #25D366; color: white; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; transition: all 0.3s ease; animation: whatsapp-float-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
  @keyframes whatsapp-float-in { 0% { transform: scale(0) translateY(50px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
  .floating-whatsapp-button::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.2); border-radius: 50%; transform: scale(0); transition: transform 0.5s ease; }
  .floating-whatsapp-button:hover { transform: scale(1.1); background-color: #128C7E; box-shadow: 0 8px 25px rgba(37,211,102,0.4); }
  .floating-whatsapp-button:hover::before { transform: scale(1.5); opacity: 0; }
  .floating-whatsapp-button i { font-size: 2rem; transition: transform 0.3s ease; position: relative; z-index: 2; }
  @keyframes whatsapp-btn-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .floating-whatsapp-button:hover i { animation: whatsapp-btn-pulse 1s infinite; }
  @media (max-width: 768px) { .floating-whatsapp-button { width: 55px; height: 55px; right: 20px; bottom: 20px; } .floating-whatsapp-button i { font-size: 1.8rem; } }
  @media (max-width: 576px) { .floating-whatsapp-button { width: 50px; height: 50px; right: 15px; bottom: 15px; } .floating-whatsapp-button i { font-size: 1.6rem; } }
`

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Make it visible after a short delay so it pops in nicely, or show immediately
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    const message = "Hello Pratham Tours, I would like to know more about your services.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {isVisible && (
        <button
          className="floating-whatsapp-button"
          onClick={openWhatsApp}
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </button>
      )}
    </>
  );
};

export default FloatingWhatsApp;
