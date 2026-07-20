import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

const policyStyles = `
  .policy-page { min-height: 100vh; background-color: #f8f9fa; }
  .policy-header { background-color: #333; background-size: cover; background-position: center; color: white; padding: 60px 0; text-align: center; }
  .policy-title { font-size: 2.5rem; margin-bottom: 10px; font-weight: 700; }
  .policy-subtitle { font-size: 1rem; opacity: 0.8; }
  .policy-container { padding: 40px 0; max-width: 900px; margin: 0 auto; }
  .policy-content { background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); margin-bottom: 30px; }
  .policy-section { margin-bottom: 30px; }
  .policy-section:last-child { margin-bottom: 0; }
  .policy-section h2 { color: #f37121; margin-bottom: 15px; font-size: 1.5rem; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  .policy-section p { margin-bottom: 15px; line-height: 1.6; color: #555; }
  .policy-list { list-style-type: disc; padding-left: 20px; margin-bottom: 15px; }
  .policy-list li { margin-bottom: 10px; line-height: 1.6; color: #555; }
  .policy-contact-info { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px; }
  .policy-contact-info p { margin-bottom: 8px; }
  .policy-contact-info p:last-child { margin-bottom: 0; }
  .policy-navigation { display: flex; justify-content: center; }
  .policy-back-button { display: inline-flex; align-items: center; gap: 10px; background-color: #f37121; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.3s ease; }
  .policy-back-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  @media (max-width: 992px) { .policy-container { padding: 30px 20px; } }
  @media (max-width: 768px) { .policy-header { padding: 40px 0; } .policy-title { font-size: 2rem; } .policy-content { padding: 25px; } .policy-section h2 { font-size: 1.3rem; } }
  @media (max-width: 576px) { .policy-container { padding: 20px 15px; } .policy-header { padding: 30px 0; } .policy-title { font-size: 1.8rem; } .policy-content { padding: 20px; } .policy-section h2 { font-size: 1.2rem; } }
  @media (max-width: 375px) { .policy-container { padding: 15px 10px; } .policy-content { padding: 15px; } .policy-title { font-size: 1.5rem; } .policy-subtitle { font-size: 0.85rem; } .policy-section h2 { font-size: 1.1rem; } .policy-back-button { padding: 10px 20px; font-size: 0.9rem; } }
`

function TermsAndConditions() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Background image URL - assuming the image is in public folder
  const headerBackground = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/assets/hero/policy-header.webp")`,
  };

  return (
    <div className="policy-page">
      <style dangerouslySetInnerHTML={{ __html: policyStyles }} />
      <SEOHead
        title="Terms & Conditions | Pratham Tours"
        description="Read the terms and conditions and booking agreement of Pratham Tours Travel Services."
        keywords="terms and conditions, booking rules, cancellation policies, liability, travel agreement, Pratham Tours"
        canonical="https://prathamtours.com/terms-and-conditions"
      />
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Terms & Conditions</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              These terms and conditions outline the rules and regulations for
              the use of FlyAnyTrip's website. By accessing this website, we
              assume you accept these terms and conditions in full. Do not
              continue to use FlyAnyTrip's website if you do not accept all of
              the terms and conditions stated on this page.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Booking and Payments</h2>
            <p>
              When making a booking with FlyAnyTrip, you agree to provide
              accurate and complete information for all travelers. Payment terms
              are as follows:
            </p>
            <ul className="policy-list">
              <li>
                A deposit of 30% of the total package price is required at the
                time of booking.
              </li>
              <li>
                Full payment must be made at least 30 days prior to the
                departure date.
              </li>
              <li>
                For bookings made within 30 days of departure, full payment is
                required at the time of booking.
              </li>
              <li>
                All payments are processed securely through our payment gateway.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Cancellation Policy</h2>
            <p>
              Cancellation of bookings must be made in writing. The following
              cancellation charges apply:
            </p>
            <ul className="policy-list">
              <li>
                More than 30 days before departure: 10% of total package price
              </li>
              <li>15-30 days before departure: 30% of total package price</li>
              <li>7-14 days before departure: 50% of total package price</li>
              <li>
                Less than 7 days before departure: 100% of total package price
              </li>
            </ul>
            <p>
              We strongly recommend purchasing travel insurance to cover any
              unforeseen circumstances.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Package Changes</h2>
            <p>
              FlyAnyTrip reserves the right to make changes to any of the
              facilities, services or prices described in our brochures or
              website. We will advise you of any changes known at the time of
              booking.
            </p>
            <p>
              If a major change becomes necessary, we will inform you as soon as
              reasonably possible if there is time before your departure.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Travel Documents</h2>
            <p>
              It is your responsibility to ensure that you have valid travel
              documents, including:
            </p>
            <ul className="policy-list">
              <li>
                Passport with minimum 6 months validity from the date of return
              </li>
              <li>Necessary visas for all destinations on your itinerary</li>
              <li>Travel insurance documentation</li>
              <li>Any required health certificates or vaccination records</li>
            </ul>
            <p>
              FlyAnyTrip is not responsible for any issues arising from
              incomplete or invalid travel documentation.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Liability</h2>
            <p>
              FlyAnyTrip acts as an intermediary between you and the various
              service providers such as airlines, hotels, transport companies,
              and other suppliers. While we select these providers with
              reasonable care, we cannot be held responsible for any acts or
              omissions of these third parties.
            </p>
            <p>
              Our liability is limited to the provisions of services as
              described in the package details. We are not liable for any
              injury, damage, loss, accident, delay, or irregularity that may be
              caused by defect or default of any company or person engaged in
              conveying passengers or carrying out travel arrangements.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of India, and you submit to the
              non-exclusive jurisdiction of the courts located in Gujarat,
              India.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <div className="policy-contact-info">
              <p>
                <strong>Email:</strong> contact.us.pratham-tours@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> +91 96870 61413, +91 89282 89283
              </p>
              <p>
                <strong>Address:</strong> 428-429 Trivia Complex Racecourse,
                Vadodara, Gujarat 390007
              </p>
            </div>
          </section>
        </div>

        <div className="policy-navigation">
          <Link to="/" className="policy-back-button">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;