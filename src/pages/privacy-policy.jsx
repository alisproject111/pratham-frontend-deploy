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

function PrivacyPolicy() {
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
        title="Privacy Policy | Pratham Tours"
        description="Privacy policy and data protection guidelines of Pratham Tours Travel Services."
        keywords="privacy policy, data protection, security, booking terms, Pratham Tours"
        canonical="https://prathamtours.com/privacy-policy"
      />
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to FlyAnyTrip. We respect your privacy and are committed
              to protecting your personal data. This privacy policy will inform
              you about how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law
              protects you.
            </p>
            <p>
              This privacy policy aims to give you information on how FlyAnyTrip
              collects and processes your personal data through your use of this
              website, including any data you may provide through this website
              when you sign up for our newsletter, purchase a product or
              service, or take part in a competition.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. The Data We Collect About You</h2>
            <p>
              Personal data, or personal information, means any information
              about an individual from which that person can be identified. It
              does not include data where the identity has been removed
              (anonymous data).
            </p>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Identity Data</strong> includes first name, last name,
                username or similar identifier, title, date of birth and gender.
              </li>
              <li>
                <strong>Contact Data</strong> includes billing address, delivery
                address, email address and telephone numbers.
              </li>
              <li>
                <strong>Financial Data</strong> includes bank account and
                payment card details.
              </li>
              <li>
                <strong>Transaction Data</strong> includes details about
                payments to and from you and other details of products and
                services you have purchased from us.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="policy-list">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know. They will only process your personal data on our
              instructions and they are subject to a duty of confidentiality.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to:
            </p>
            <ul className="policy-list">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
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

export default PrivacyPolicy;