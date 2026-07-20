const receiptStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap");
  .rt-receipt { font-family: "Open Sans", Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; color: #333; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); border-radius: 12px; position: relative; }
  .rt-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; padding-bottom: 25px; border-bottom: 2px solid #e53935; margin-bottom: 25px; }
  .rt-logo-container { flex: 1; display: flex; flex-direction: column; }
  .rt-logo { font-family: "Montserrat", sans-serif; font-size: 32px; font-weight: 700; color: #e53935; letter-spacing: -0.5px; }
  .rt-logo-tagline { font-size: 12px; color: #7f8c8d; margin-top: 5px; }
  .rt-company-info { font-size: 13px; color: #555; flex: 1; text-align: center; line-height: 1.5; }
  .rt-company-info p { margin: 3px 0; }
  .rt-receipt-title-container { flex: 1; text-align: right; }
  .rt-receipt-title { font-family: "Montserrat", sans-serif; font-size: 24px; margin: 0 0 8px 0; color: #e53935; font-weight: 600; }
  .rt-receipt-id { font-size: 14px; color: #555; margin-bottom: 5px; font-weight: 500; }
  .rt-receipt-date { font-size: 14px; color: #555; }
  .rt-details { margin: 25px 0; }
  .rt-section { margin-bottom: 30px; background-color: #f9f9f9; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); border-left: 4px solid #e53935; }
  .rt-section-title { font-family: "Montserrat", sans-serif; font-weight: 600; margin-bottom: 18px; color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px; display: flex; align-items: center; }
  .rt-section-title i { margin-right: 10px; color: #e53935; }
  .rt-detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #eee; }
  .rt-detail-label { font-weight: 600; color: #444; }
  .rt-total-row { font-weight: 700; font-size: 18px; margin-top: 20px; padding-top: 15px; border-top: 2px solid #e53935; color: #e53935; }
  .rt-payment-success { color: #e53935; font-weight: 700; }
  .rt-traveler-item { margin-bottom: 18px; border: 1px solid #eee; border-radius: 6px; overflow: hidden; }
  .rt-traveler-header { background-color: #eef2f7; padding: 10px 15px; font-weight: 600; color: #2c3e50; border-bottom: 1px solid #ddd; font-family: "Montserrat", sans-serif; }
  .rt-traveler-details { padding: 15px; display: flex; flex-wrap: wrap; background-color: #fff; }
  .rt-traveler-detail { flex: 1 0 30%; padding: 8px 12px; min-width: 150px; }
  .rt-additional-travelers { margin-top: 15px; }
  .rt-ticket-note { background-color: #feeeee; border-left: 4px solid #e53935; padding: 15px 20px; margin: 25px 0; display: flex; align-items: center; border-radius: 6px; }
  .rt-ticket-note i { font-size: 20px; color: #e53935; margin-right: 15px; }
  .rt-ticket-note p { margin: 0; color: #2c3e50; font-weight: 500; }
  .rt-footer { margin-top: 35px; border-top: 1px solid #ddd; padding-top: 25px; font-size: 13px; color: #555; }
  .rt-terms { margin-bottom: 20px; }
  .rt-terms h4 { font-family: "Montserrat", sans-serif; margin-top: 0; margin-bottom: 10px; color: #2c3e50; font-size: 16px; }
  .rt-terms ul { margin: 0; padding-left: 20px; }
  .rt-terms li { margin-bottom: 6px; }
  .rt-contact { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px dashed #eee; }
  .rt-contact p { margin: 6px 0; }
  .rt-barcode { display: none; }
  @media print { .rt-receipt { box-shadow: none; border: none; padding: 15px; max-width: 100%; } .ps-receipt-modal-header, .ps-receipt-modal-footer, .ps-print-button { display: none !important; } .rt-section { page-break-inside: avoid; } .rt-header, .rt-footer { page-break-inside: avoid; } .rt-traveler-item { page-break-inside: avoid; } }
  @media (max-width: 768px) { .rt-header { flex-direction: column; } .rt-logo-container, .rt-company-info, .rt-receipt-title-container { width: 100%; text-align: center; margin-bottom: 15px; } .rt-traveler-details { flex-direction: column; } .rt-traveler-detail { width: 100%; min-width: 100%; } .rt-detail-row { flex-direction: column; align-items: flex-start; } .rt-detail-label { margin-bottom: 5px; } }
`

const ReceiptTemplate = ({ orderData, bookingDetails, packageDetails }) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Ensure we have valid data by providing defaults
  const order = orderData || {
    order_id: "Unknown",
    order_amount: 0,
    order_status: "UNKNOWN",
  };

  const booking = bookingDetails || {
    fullName: "Customer",
    email: "customer@example.com",
    phone: "N/A",
    travelDate: formattedDate,
    travelers: 1,
  };

  const packageInfo = packageDetails || {
    name: "Travel Package",
    location: "Destination",
    duration: "N/A",
    price: order.order_amount || 0,
  };

  return (
    <div className="rt-receipt">
      <style dangerouslySetInnerHTML={{ __html: receiptStyles }} />
      <div className="rt-header">
        <div className="rt-logo-container">
          <div className="rt-logo">Pratham Tours</div>
          <div className="rt-logo-tagline">Explore. Experience. Enjoy.</div>
        </div>
        <div className="rt-company-info">
          <p>Pratham Tours Travel Services </p>
          <p>428-429 Trivia Complex Racecourse,</p>
          <p>Vadodara, Gujarat 390007</p>
          <p>GST: 07AABCT1234Z1ZL</p>
        </div>
        <div className="rt-receipt-title-container">
          <h1 className="rt-receipt-title">Booking Receipt</h1>
          <div className="rt-receipt-id">Receipt #{order.order_id}</div>
          <div className="rt-receipt-date">Date: {formattedDate}</div>
        </div>
      </div>

      <div className="rt-details">
        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-user-circle"></i> Customer Information
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Name:</span>
            <span>{booking.fullName}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Email:</span>
            <span>{booking.email}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Phone:</span>
            <span>{booking.phone}</span>
          </div>
        </div>

        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-map-marked-alt"></i> Package Details
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Package Name:</span>
            <span>{packageInfo.name}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Destination:</span>
            <span>{packageInfo.location}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Duration:</span>
            <span>{packageInfo.duration} Days</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Travel Date:</span>
            <span>{booking.travelDate}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Number of Travelers:</span>
            <span>{booking.travelers}</span>
          </div>
        </div>

        {/* Travelers Section */}
        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-users"></i> Traveler Details
          </div>

          {/* Lead Traveler */}
          <div className="rt-traveler-item">
            <div className="rt-traveler-header">Lead Traveler</div>
            <div className="rt-traveler-details">
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Name:</span>
                <span>{booking.fullName}</span>
              </div>
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Gender:</span>
                <span>{booking.gender || "Not specified"}</span>
              </div>
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Age:</span>
                <span>{booking.age || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Additional Travelers */}
          {booking.additionalTravelers &&
            booking.additionalTravelers.length > 0 && (
              <div className="rt-additional-travelers">
                {booking.additionalTravelers.map((traveler, index) => (
                  <div key={index} className="rt-traveler-item">
                    <div className="rt-traveler-header">
                      Traveler {index + 2}
                    </div>
                    <div className="rt-traveler-details">
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Name:</span>
                        <span>{traveler.fullName}</span>
                      </div>
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Gender:</span>
                        <span>{traveler.gender || "Not specified"}</span>
                      </div>
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Age:</span>
                        <span>{traveler.age || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-credit-card"></i> Payment Information
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Order ID:</span>
            <span>{order.order_id}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Payment Status:</span>
            <span className="rt-payment-success">
              {order.order_status || "PAID"}
            </span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Price per Person:</span>
            <span>Rs {(packageInfo.price || 0).toLocaleString("en-IN")}</span>
          </div>
          <div className="rt-detail-row rt-total-row">
            <span className="rt-detail-label">Total Amount:</span>
            <span>Rs {(order.order_amount || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Barcode section removed */}

      <div className="rt-ticket-note">
        <i className="fas fa-ticket-alt"></i>
        <p>
          Your original booking package tickets will be provided within a few
          hours.
        </p>
      </div>

      <div className="rt-footer">
        <div className="rt-terms">
          <h4>Terms & Conditions</h4>
          <ul>
            <li>This receipt is proof of payment only.</li>
            <li>
              Cancellation policy: 48 hours notice required for full refund.
            </li>
            <li>
              Please carry a valid ID proof for all travelers during the trip.
            </li>
            <li>
              Package inclusions are as per the itinerary shared at the time of
              booking.
            </li>
          </ul>
        </div>
        <div className="rt-contact">
          <p>Thank you for booking with Pratham Tours!</p>
          <p>
            For any queries, please contact us at{" "}
            <strong>booking.pratham-tours@gmail.com</strong> or call{" "}
            <strong>+91 96870 61413 / +91 89282 89283</strong>
          </p>
          <p>© {new Date().getFullYear()} Pratham Tours. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
