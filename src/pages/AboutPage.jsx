import AnimatedElement from "../components/AnimatedElement";
import CounterAnimation from "../components/CounterAnimation";
import SEOHead from "../components/SEOHead";
import LazyImage from "../components/LazyImage";

const aboutStyles = `
  .about-page { min-height: 100vh; }
  .about-hero-section { height: 50vh; min-height: 300px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
  .about-page-title { font-size: 3rem; font-weight: 700; margin-bottom: 10px; }
  .about-page-subtitle { font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
  .about-content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
  .about-content-grid.reverse { direction: rtl; }
  .about-content-grid.reverse .about-content-text { direction: ltr; }
  .about-content-text p { margin-bottom: 20px; color: #555; line-height: 1.8; }
  .about-content-image { border-radius: 8px; overflow: hidden; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); height: 350px; }
  .about-content-image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .about-content-image:hover img { transform: scale(1.05); }
  .about-why-choose-section { background-color: #f9f9f9; padding: 80px 0; position: relative; }
  .about-why-choose-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 40px; }
  .about-why-choose-card { background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; display: flex; flex-direction: column; align-items: center; }
  .about-why-choose-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); }
  .about-why-choose-icon { width: 70px; height: 70px; background-color: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .about-why-choose-icon i { font-size: 2rem; color: #f37121; }
  .about-why-choose-title { font-size: 1.3rem; margin-bottom: 15px; color: #333; }
  .about-why-choose-text { color: #666; line-height: 1.6; flex-grow: 1; }
  .about-services-section { padding: 80px 0; }
  .about-services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-top: 40px; }
  .about-service-card { background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); display: flex; align-items: flex-start; gap: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; }
  .about-service-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); }
  .about-service-icon { width: 60px; height: 60px; background-color: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .about-service-icon i { font-size: 1.5rem; color: #f37121; }
  .about-service-content { flex-grow: 1; }
  .about-service-title { font-size: 1.2rem; margin-bottom: 10px; color: #333; }
  .about-service-text { color: #666; line-height: 1.6; }
  .about-values-section { background-color: white; padding: 80px 0; }
  .about-values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
  .about-value-card { background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; display: flex; flex-direction: column; align-items: center; }
  .about-value-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); }
  .about-value-icon { width: 70px; height: 70px; background-color: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .about-value-icon i { font-size: 2rem; color: #f37121; }
  .about-value-title { font-size: 1.3rem; margin-bottom: 15px; color: #333; }
  .about-value-text { color: #666; line-height: 1.6; flex-grow: 1; }
  .about-mission-section { background-color: #f9f9f9; padding: 80px 0; position: relative; overflow: hidden; }
  .about-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center; }
  .about-stat-item { background-color: white; padding: 30px 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; }
  .about-stat-item:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); }
  .about-stat-number { font-size: 2.5rem; font-weight: 700; color: #f37121; margin-bottom: 10px; }
  .about-stat-label { color: #666; font-size: 1rem; }
  @media (max-width: 992px) { .about-content-grid { grid-template-columns: 1fr; gap: 30px; } .about-why-choose-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } .about-services-grid { grid-template-columns: 1fr; gap: 20px; } .about-values-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } .about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
  @media (max-width: 768px) { .about-hero-section { height: 40vh; min-height: 250px; } .about-page-title { font-size: 2.2rem; } .about-page-subtitle { font-size: 1rem; } .about-content-grid { gap: 25px; } .about-content-text p { font-size: 0.9rem; } .about-content-image { height: 300px; } .about-why-choose-section, .about-services-section, .about-values-section, .about-mission-section, .about-stats { padding: 40px 0; } .about-why-choose-card, .about-service-card, .about-value-card { padding: 20px; } .about-why-choose-icon, .about-value-icon { width: 60px; height: 60px; margin-bottom: 15px; } .about-why-choose-title, .about-value-title { font-size: 1.2rem; margin-bottom: 10px; } .about-why-choose-text, .about-value-text, .about-service-text { font-size: 0.9rem; } .about-service-icon { width: 50px; height: 50px; } .about-service-title { font-size: 1.1rem; } .about-stat-number { font-size: 2.2rem; } .about-stat-label { font-size: 0.9rem; } }
  @media (max-width: 576px) { .about-hero-section { height: 35vh; min-height: 200px; } .about-page-title { font-size: 1.8rem; } .about-page-subtitle { font-size: 0.9rem; } .about-why-choose-grid, .about-values-grid, .about-stats-grid { grid-template-columns: 1fr; gap: 20px; } .about-content-image { height: 250px; } .about-why-choose-card, .about-service-card, .about-value-card, .about-stat-item { padding: 15px; max-width: 350px; margin: 0 auto; width: 100%; } .about-service-card { flex-direction: column; align-items: center; text-align: center; gap: 15px; } .about-why-choose-icon, .about-value-icon { width: 50px; height: 50px; margin-bottom: 15px; } .about-service-icon { width: 40px; height: 40px; } .about-stat-number { font-size: 2rem; } }
  @media (max-width: 375px) { .about-page-title { font-size: 1.5rem; } .about-page-subtitle { font-size: 0.8rem; } .about-stat-number { font-size: 1.8rem; } .about-content-image { height: 200px; } }
`

function AboutPage() {
  return (
    <div className="about-page">
      <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />
      <SEOHead
        title="About Us | Pratham Tours - Best Travel & Holiday Agency"
        description="Learn about Pratham Tours, India's trusted travel agency since 2025. We offer best domestic & international tour packages with 10,000+ happy customers. Expert travel planning & 24/7 support."
        keywords="about Pratham Tours, travel agency India, tour operator, travel company, vacation planner, holiday specialist, travel services, domestic tours, international tours, travel experts"
        canonical="https://prathamtours.com/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Pratham Tours",
          description: "Learn about Pratham Tours travel agency",
          url: "https://prathamtours.com/about",
          mainEntity: {
            "@type": "TravelAgency",
            name: "Pratham Tours",
            foundingDate: "2025",
            numberOfEmployees: "10-50",
            description:
              "Leading travel agency offering domestic and international tour packages",
          },
        }}
      />
      <div
        className="about-hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/about/about-hero.webp)`,
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="about-page-title">About Us</h1>
            <p className="about-page-subtitle">Learn more about Pratham Tours</p>
          </AnimatedElement>
        </div>
      </div>

      <section className="about-intro section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Story</h2>
              <p className="section-subtitle">
                How we started and where we're going
              </p>
            </div>
          </AnimatedElement>

          <div className="about-content-grid">
            <AnimatedElement animation="fade-right">
              <div className="about-content-text">
                <p>
                  Pratham Tours was founded in 2025 with a simple mission: to make
                  travel accessible, enjoyable, and enriching for everyone. We
                  believe that travel has the power to transform lives, broaden
                  perspectives, and create lasting memories.
                </p>
                <p>
                  What started as a small team of passionate travelers has grown
                  into a trusted travel company serving thousands of happy
                  customers across India. We specialize in creating customized
                  travel experiences that cater to diverse interests, budgets,
                  and preferences.
                </p>
                <p>
                  Our focus on customer satisfaction, attention to detail, and
                  deep knowledge of destinations sets us apart. We're not just
                  selling packages; we're crafting experiences that will stay
                  with you for a lifetime.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-left">
              <div className="about-content-image">
                <LazyImage
                  src="/assets/about/about-img-1.webp"
                  alt="Our team planning travel experiences"
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-why-choose-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Why Choose Pratham Tours</h2>
              <p className="section-subtitle">
                What makes us different from other travel agencies
              </p>
            </div>
          </AnimatedElement>

          <div className="about-why-choose-grid">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3 className="about-why-choose-title">Best Value</h3>
                <p className="about-why-choose-text">
                  We negotiate the best rates with our partners to offer you
                  competitive prices without compromising on quality.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="about-why-choose-title">Safe & Secure</h3>
                <p className="about-why-choose-text">
                  Your safety is our priority. We partner with trusted service
                  providers and offer 24/7 support during your trip.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-thumbs-up"></i>
                </div>
                <h3 className="about-why-choose-title">
                  Satisfaction Guaranteed
                </h3>
                <p className="about-why-choose-text">
                  We're committed to your satisfaction. If you're not happy with
                  any aspect of your trip, we'll make it right.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <h3 className="about-why-choose-title">Expert Guidance</h3>
                <p className="about-why-choose-text">
                  Our travel experts have firsthand knowledge of destinations
                  and can provide personalized recommendations.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-services-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">
                Comprehensive travel solutions for every need
              </p>
            </div>
          </AnimatedElement>

          <div className="about-services-grid">
            <AnimatedElement animation="fade-up" delay={150}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-hotel"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Hotel Accommodations</h3>
                  <p className="about-service-text">
                    Handpicked hotels ranging from budget-friendly options to
                    luxury resorts, ensuring comfort and quality.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-route"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Tour Packages</h3>
                  <p className="about-service-text">
                    Comprehensive tour packages including transportation,
                    accommodation, sightseeing, and activities.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={250}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-car"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Transportation</h3>
                  <p className="about-service-text">
                    Car rentals, airport transfers, and private transportation
                    services for hassle-free travel.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={350}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-hiking"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Adventure Activities</h3>
                  <p className="about-service-text">
                    Exciting adventure activities and experiences, from trekking
                    and water sports to wildlife safaris.
                  </p>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-subtitle">What drives us every day</p>
            </div>
          </AnimatedElement>

          <div className="about-content-grid reverse">
            <AnimatedElement animation="fade-left">
              <div className="about-content-text">
                <p>
                  Our mission is to make travel accessible, enjoyable, and
                  enriching for everyone. We believe that travel has the power
                  to transform lives, broaden perspectives, and create lasting
                  memories. That's why we're dedicated to crafting exceptional
                  travel experiences that cater to diverse interests, budgets,
                  and preferences.
                </p>
                <p>
                  We strive to provide our customers with the highest level of
                  service, ensuring that every aspect of their journey is
                  seamless and memorable. From the moment you book with us to
                  the time you return home, we're committed to exceeding your
                  expectations and making your travel dreams a reality.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right">
              <div className="about-content-image">
                <LazyImage
                  src="/assets/about/about-img-2.jpeg"
                  alt="Beautiful destination"
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </div>
          </AnimatedElement>

          <div className="about-values-grid">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="about-value-title">Passion for Travel</h3>
                <p className="about-value-text">
                  We're travelers at heart. Our passion for exploration drives
                  us to create exceptional experiences for our customers.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="about-value-title">Customer First</h3>
                <p className="about-value-text">
                  Your satisfaction is our priority. We go above and beyond to
                  ensure every journey exceeds your expectations.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3 className="about-value-title">Responsible Tourism</h3>
                <p className="about-value-text">
                  We're committed to sustainable travel practices that respect
                  local cultures and protect the environment.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* New Our Team Section
      <section className="about-team-section section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Team</h2>
              <p className="section-subtitle">
                Meet the experts behind Pratham Tours
              </p>
            </div>
          </AnimatedElement>

          <div className="about-team-grid">

            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/anshuman.webp"
                      alt="Anshuman Singh"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:asinghvns99@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Anshuman_myth?t=7qup-oP1WEjUOzL_jUy5uQ&s=08" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/anshuman7208?igsh=NTZrNzFydWFjZjA0" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/anshuman-singh-819026268?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Anshuman Singh</h4>
                    <p className="about-team-position">CEO & Founder</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/vibhu.webp"
                      alt="Vibhu Panchal"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:aavibhu@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/MeAurum" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/vibhu.who?igsh=MTBhb3dzbjNuN3ZiYg==" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/vibhu-panchal-658b93318/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Vibhu Panchal</h4>
                    <p className="about-team-position">CTO & Co-Founder</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/alis.webp"
                      alt="Alis Patel"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:alispatel123098@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/alis111patel" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/alispatel111/" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/alispatel/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Alis Patel</h4>
                    <p className="about-team-position">MERN Developer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/abhishek.webp"
                      alt="Abhishek Jha"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:abhishekjha2707@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Abhishek_272003?t=lbk8oEqWQ4TOhw7tt0AYEQ&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/abhishek_jha_7/?igsh=MTh2ZG03ejV0MmNpMg%3D%3D#" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/abhishek-jha-35732230a/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Abhishek Jha</h4>
                    <p className="about-team-position">MERN Developer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/swastik.webp"
                      alt="Swastik Moolya"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:aavibhu@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Swastik Moolya</h4>
                    <p className="about-team-position">Devops Engineer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/divya.webp"
                      alt="Divya Panchariya"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:divympan180@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Divy_pan19?t=bHaLCDc3B-ZRkmafyojE3A&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/divy_panchariya?igsh=MWt6YXl1eG9rbWFpbA==" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/divy-m-panchariya-a47506242?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Divya Panchariya</h4>
                    <p className="about-team-position">Chief Marketing Officer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/ayushi.webp"
                      alt="Ayushi Babu"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:ayushibabu26@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/AayushiBabu?t=I3a1N8tPY01ZblFM_sxwXw&s=08" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/aayushi19921?igsh=dWY4Y2I4bjBnN2Y4" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/aayushi-babu-050b2a199?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Ayushi Babu</h4>
                    <p className="about-team-position">Package Curator</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <LazyImage
                      src="/assets/team/parth.webp"
                      alt="Parth Raval"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:parthraval99@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/parthraval99?t=4utDD3K6bthn5Hy1lG6jgA&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/its_not_arjun?igsh=MWVyMHY0eDVxZ3I3" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/parth-raval-8090911aa" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Parth Raval</h4>
                    <p className="about-team-position">Art Director</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section> 
      */}

      <section className="about-stats section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={2} suffix="+" />
                </div>
                <div className="about-stat-label">Years Experience</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={10000} suffix="+" />
                </div>
                <div className="about-stat-label">Happy Customers</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={100} suffix="+" />
                </div>
                <div className="about-stat-label">Destinations</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={500} suffix="+" />
                </div>
                <div className="about-stat-label">Packages</div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;