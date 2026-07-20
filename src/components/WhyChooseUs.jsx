import React from "react";
import AnimatedElement from "./AnimatedElement";

const features = [
  { id: 1, icon: "fas fa-headset",   title: "24/7 Expert Support",    description: "Our travel experts are available round the clock to assist you at every step of your journey." },
  { id: 2, icon: "fas fa-tags",      title: "Best Price Guarantee",    description: "We offer the most competitive rates in the market without compromising on quality." },
  { id: 3, icon: "fas fa-user-tie",  title: "Expert Tour Managers",    description: "Travel with our experienced, friendly, and knowledgeable tour managers who ensure a hassle-free journey." },
  { id: 4, icon: "fas fa-shield-alt",title: "Safe & Secure",           description: "Your safety is our priority. We partner only with verified and trusted travel associates." },
];

const styles = `
  .why-choose-us {
    padding: 100px 0;
    background-color: #fffaf5;
    background-image:
      linear-gradient(135deg, rgba(255,250,245,0.96) 0%, rgba(255,250,245,0.90) 100%),
      url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
    overflow: hidden;
  }
  @keyframes bgPulse {
    0%   { transform: scale(1);   opacity: 0.8; }
    50%  { transform: scale(1.1); opacity: 1;   }
    100% { transform: scale(1);   opacity: 0.8; }
  }
  .why-choose-us::before {
    content: '';
    position: absolute;
    top: -200px; right: -100px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(243,113,33,0.05) 0%, transparent 70%);
    pointer-events: none;
    animation: bgPulse 8s infinite alternate ease-in-out;
  }
  .luxury-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
    max-width: 1300px;
  }
  .luxury-left {
    flex: 0 0 40%;
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }
  .luxury-title {
    font-size: 2.8rem;
    font-weight: 800;
    color: #000;
    line-height: 1.2;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes textShine {
    0%   { background-position: 0% 50%;   }
    100% { background-position: 200% 50%; }
  }
  .luxury-title .text-highlight {
    font-style: italic;
    font-family: "Georgia", serif;
    font-weight: normal;
    background: linear-gradient(90deg, #d85c13, #e67537, #d85c13);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShine 4s linear infinite;
    display: inline-block;
  }
  .luxury-subtitle {
    font-size: 1.05rem;
    color: #333;
    font-weight: 500;
    line-height: 1.6;
    max-width: 90%;
    text-shadow: 0 0 15px rgba(255,255,255,0.8);
  }
  .luxury-right { flex: 0 0 55%; }
  .luxury-list  { display: flex; flex-direction: column; }
  .luxury-list-item {
    display: flex;
    gap: 25px;
    padding: 30px 20px;
    border-bottom: 1px solid rgba(243,113,33,0.25);
    position: relative;
  }
  .luxury-list-item:first-child { border-top: 1px solid rgba(243,113,33,0.25); }
  .item-content { flex: 1; }
  .item-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #111;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 0 0 10px rgba(255,255,255,1);
  }
  .item-title i {
    color: #f37121;
    font-size: 1.1rem;
    background: rgba(243,113,33,0.15);
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .item-desc {
    font-size: 1rem;
    color: #222;
    font-weight: 500;
    line-height: 1.6;
    text-shadow: 0 0 15px rgba(255,255,255,0.9);
  }
  @media (max-width: 992px) {
    .luxury-container { flex-direction: column; gap: 40px; }
    .luxury-left { flex: 0 0 100%; position: relative; top: 0; text-align: center; }
    .luxury-title { font-size: 2.5rem; }
    .luxury-subtitle { max-width: 100%; margin: 0 auto; }
    .luxury-right { flex: 0 0 100%; width: 100%; }
  }
  @media (max-width: 768px) {
    .why-choose-us { padding: 60px 0; }
    .luxury-title { font-size: 2.2rem; }
    .luxury-list-item { gap: 20px; padding: 25px 15px; }
    .item-title { font-size: 1.25rem; }
    .item-desc  { font-size: 0.95rem; }
  }
  @media (max-width: 576px) {
    .why-choose-us { padding: 50px 0; }
    .luxury-title { font-size: 1.8rem; }
    .luxury-subtitle { font-size: 0.95rem; }
    .luxury-list-item { padding: 20px 10px; gap: 15px; }
    .item-title { font-size: 1.15rem; gap: 10px; }
    .item-title i { width: 32px; height: 32px; font-size: 1rem; }
    .item-desc  { font-size: 0.9rem; }
  }
`

const WhyChooseUs = ({ settings }) => {
  let displayFeatures = features;
  if (settings?.homeWhyChooseFeatures) {
    try {
      let parsed = settings.homeWhyChooseFeatures;
      if (typeof parsed === 'string') {
        parsed = parsed.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#x2F;/g, '/').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {
          try {
            // eslint-disable-next-line no-eval
            parsed = eval('(' + parsed + ')');
          } catch (e2) {}
        }
      }
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch(e) {}
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        displayFeatures = parsed;
      }
    } catch (e) {
      console.error("Error parsing why choose features:", e);
    }
  }

  return (
    <section className="why-choose-us section">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container luxury-container">
        <div className="luxury-left">
          <AnimatedElement animation="fade-up">
            <h2 className="luxury-title">
              {settings?.homeWhyChooseTitle || "Why Choose Us"}
            </h2>
            <p className="luxury-subtitle">
              {settings?.homeWhyChooseSubtitle || "We are committed to providing you with the best travel experiences, ensuring every journey is memorable, safe, and perfectly tailored to your dreams."}
            </p>
          </AnimatedElement>
        </div>

        <div className="luxury-right">
          <div className="luxury-list">
            {displayFeatures.map((feature, index) => (
              <AnimatedElement key={feature.id || index} animation="fade-up" delay={index * 150}>
                <div className="luxury-list-item">
                  <div className="item-content">
                    <h3 className="item-title">
                      <i className={feature.icon}></i> {feature.title}
                    </h3>
                    <p className="item-desc">{feature.description}</p>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
