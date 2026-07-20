import React, { useState, useEffect } from "react";
import { getImageUrl } from "../config/api";
import AnimatedElement from "./AnimatedElement";

const testimonialsData = [
  { id: 1, name: "James Brown",      role: "CEO Saving Company", text: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar pellentesque mauris.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Hindley Earnshaw", role: "@Hindley_Ea",        text: "Congue mauris rhoncus aenean vel elit. Morbi non arcu risus quis varius tincidunt.",    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Linda Blair",      role: "Happy Traveler",     text: "Morbi non arcu risus quis varius. Tincidunt augue interdum velit euismod.",              avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Good Job!",        role: "Happy Traveler",     text: "Semper feugiat nibh sed pulvinar proin gravida facilisi morbi tempus iaculis phasellus.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
  { id: 5, name: "Victoria Watson",  role: "Travel Blogger",     text: "Diam maecenas ultricies mi eget. In nulla posuere sollicitudin aliquam. Adipiscing enim eu turpis egestas.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
  { id: 6, name: "Isabella Lipton",  role: "Photographer",       text: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin amet nulla morbi eu non gravida.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
  { id: 7, name: "Basil Hallward",   role: "Co-Founder",         text: "Enim lobortis scelerisque fermentum dui faucibus. Sodales ut etiam sit amet nisl. Semper feugiat nibh.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
];

const styles = `
  .testimonials-section {
    padding: 80px 0;
    background-color: #f7f9fa;
    background-image:
      linear-gradient(135deg, rgba(247,249,250,0.95) 0%, rgba(247,249,250,0.88) 100%),
      url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
  }
  .carousel-viewport { overflow: hidden; max-width: 1200px; margin: 40px auto 0; padding: 10px 0; }
  .carousel-track    { display: flex; transition: transform 0.6s ease-in-out; }
  .carousel-slide    { padding: 0 15px; box-sizing: border-box; }
  .uniform-card {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.2);
    display: flex; flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    height: 100%;
  }
  .uniform-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.08); background: rgba(255,255,255,0.75); }
  .uniform-quote-mark { font-size: 3rem; font-weight: 900; color: #313d4f; line-height: 0.6; font-family: Georgia, serif; margin-bottom: 12px; }
  .uniform-text       { font-size: 0.9rem; color: #6a7280; line-height: 1.6; margin-bottom: 20px; flex: 1; }
  .uniform-author-row { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .uniform-author-info h4 { font-size: 0.95rem; font-weight: 800; color: #1a202c; margin: 0 0 3px; }
  .uniform-author-info p  { font-size: 0.8rem;  color: #8492a6; margin: 0; }
  .uniform-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 40px; }
  .carousel-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; cursor: pointer; transition: all 0.3s ease; }
  .carousel-dots .dot.active { background: #313d4f; transform: scale(1.2); }
  @media (max-width: 768px) { .uniform-card { padding: 30px; } }
`

const Testimonials = ({ settings }) => {
  let displayTestimonials = testimonialsData;
  if (settings?.homeTestimonials) {
    try {
      let parsed = settings.homeTestimonials;
      if (typeof parsed === 'string') {
        while (parsed.includes('&amp;')) parsed = parsed.replace(/&amp;/g, '&');
        parsed = parsed.replace(/&quot;/g, '"').replace(/&#x2F;/ig, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
        try { parsed = JSON.parse(parsed); } catch (e) {
          try { /* eslint-disable-next-line no-eval */ parsed = eval('(' + parsed + ')'); } catch (e2) {}
        }
      }
      if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
      if (Array.isArray(parsed) && parsed.length > 0) { displayTestimonials = parsed; }
    } catch (e) { console.error("Error parsing testimonials:", e); }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setItemsToShow(1);
      else if (window.innerWidth <= 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxIdx = displayTestimonials.length - itemsToShow;
    if (currentIndex > maxIdx) setCurrentIndex(Math.max(0, maxIdx));
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIdx ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [itemsToShow, currentIndex, displayTestimonials.length]);

  const maxIndex = Math.max(0, displayTestimonials.length - itemsToShow);

  return (
    <section className="testimonials-section section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header text-center">
            <h2 className="section-title">{settings?.homeTestimonialsTitle || "What Our Clients Say"}</h2>
            <p className="section-subtitle">{settings?.homeTestimonialsSubtitle || "Real experiences from our valued travelers"}</p>
          </div>
        </AnimatedElement>

        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
            {displayTestimonials.map((testimonial, idx) => (
              <div key={testimonial.id || idx} className="carousel-slide" style={{ flex: `0 0 ${100 / itemsToShow}%` }}>
                <div className="uniform-card">
                  <div className="uniform-quote-mark">"</div>
                  <p className="uniform-text">{testimonial.text}</p>
                  <div className="uniform-author-row">
                    <div className="uniform-author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.location || testimonial.role || "Happy Traveler"}</p>
                    </div>
                    <img src={getImageUrl(testimonial.image || testimonial.avatar)} alt="Avatar" className="uniform-avatar" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-dots">
          {[...Array(maxIndex + 1)].map((_, idx) => (
            <span key={idx} className={`dot ${idx === currentIndex ? "active" : ""}`} onClick={() => setCurrentIndex(idx)}></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
