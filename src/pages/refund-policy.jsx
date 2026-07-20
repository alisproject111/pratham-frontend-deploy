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

function RefundPolicy() {
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
        title="Refund Policy | Pratham Tours"
        description="Cancellation guidelines and refund terms of Pratham Tours Travel Services."
        keywords="refund policy, cancellation refund, tour cancel, travel return, Pratham Tours refund policy"
        canonical="https://prathamtours.com/refund-policy"
      />
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Refund Policy</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              At FlyAnyTrip, we strive to ensure that our customers are
              completely satisfied with their travel experiences. This Refund
              Policy outlines the terms and conditions for refunds on bookings
              made through our website or directly with our customer service
              team.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Cancellation and Refund Schedule</h2>
            <p>
              Refunds are processed according to the following schedule, based
              on when the cancellation request is received:
            </p>
            <ul className="policy-list">
              <li>
                <strong>More than 30 days before departure:</strong> 90% refund
                of the total amount paid
              </li>
              <li>
                <strong>15-30 days before departure:</strong> 70% refund of the
                total amount paid
              </li>
              <li>
                <strong>7-14 days before departure:</strong> 50% refund of the
                total amount paid
              </li>
              <li>
                <strong>Less than 7 days before departure:</strong> No refund
              </li>
            </ul>
            <p>
              All cancellation requests must be submitted in writing via email
              to booking.pratham-tours@gmail.com or through our contact form on the
              website.
            </p>
          </section>

          <section className="policy-section">
            <h2>3. Special Circumstances</h2>
            <p>
              In certain special circumstances, we may offer more flexible
              refund terms:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Medical Emergencies:</strong> With proper documentation
                from a medical professional, we may offer a more generous refund
                or the option to reschedule your trip without additional fees.
              </li>
              <li>
                <strong>Natural Disasters or Civil Unrest:</strong> If your
                destination becomes unsafe due to natural disasters or civil
                unrest, we will work with you to either reschedule your trip or
                provide a refund as appropriate.
              </li>
              <li>
                <strong>COVID-19 Related Issues:</strong> If travel restrictions
                are imposed due to COVID-19 that directly affect your trip, we
                will offer the option to reschedule or receive a credit for
                future travel.
              </li>
            </ul>
            <p>
              All special circumstances will be evaluated on a case-by-case
              basis and require supporting documentation.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Refund Processing Time</h2>
            <p>
              Once a refund is approved, the processing time depends on your
              payment method:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Credit/Debit Cards:</strong> 7-14 business days
              </li>
              <li>
                <strong>Bank Transfers:</strong> 5-7 business days
              </li>
              <li>
                <strong>UPI Payments:</strong> 3-5 business days
              </li>
              <li>
                <strong>Digital Wallets:</strong> 2-3 business days
              </li>
            </ul>
            <p>
              Please note that while we process refunds promptly on our end, the
              actual time for the funds to appear in your account may vary
              depending on your financial institution.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Non-Refundable Items</h2>
            <p>The following items are generally non-refundable:</p>
            <ul className="policy-list">
              <li>Travel insurance premiums</li>
              <li>Visa application fees</li>
              <li>Service fees for changes to bookings</li>
              <li>
                Any third-party charges that are non-refundable to FlyAnyTrip
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Partial Services Used</h2>
            <p>
              If you have already begun your trip and used a portion of the
              services booked, refunds will be calculated based on the unused
              portion, minus any applicable cancellation fees.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Information</h2>
            <p>
              For any questions regarding our refund policy or to request a
              refund, please contact us at:
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

export default RefundPolicy;