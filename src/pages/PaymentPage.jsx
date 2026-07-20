import { useState, useEffect, useCallback } from "react"
import { useParams, useLocation, useNavigate, Link } from "react-router-dom"
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import { apiEndpoints } from "../config/api"
import SEOHead from "../components/SEOHead"

const paymentStyles = `
  .pp-payment-page { min-height: 100vh; }
  .pp-payment-container { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin: 40px 0; }
  .pp-order-summary { background-color: white; border-radius: 12px; padding: 0; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); height: fit-content; position: sticky; top: 100px; overflow: hidden; }
  .pp-order-summary-header { background-color: #f37121; color: white; padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .pp-summary-icon { font-size: 2rem; }
  .pp-summary-title { margin: 0; font-size: 1.5rem; }
  .pp-summary-details { padding: 20px; }
  .pp-summary-item { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; transition: all 0.3s ease; }
  .pp-summary-item:last-child { border-bottom: none; }
  .pp-summary-item-icon-wrapper { display: flex; align-items: center; gap: 10px; }
  .pp-summary-item-icon { color: #f37121; width: 20px; text-align: center; }
  .pp-summary-label { color: #666; font-weight: 500; }
  .pp-summary-value { color: #333; font-weight: 600; }
  .pp-summary-item.pp-total { margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; border-bottom: none; }
  .pp-summary-item.pp-total .pp-summary-label, .pp-summary-item.pp-total .pp-summary-value { font-size: 1.2rem; color: #f37121; font-weight: 700; }
  .pp-customer-details { padding: 20px; background-color: #f8f9fa; }
  .pp-customer-details h3 { margin: 0 0 15px 0; color: #333; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; }
  .pp-customer-icon { color: #f37121; }
  .pp-customer-info { background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); }
  .pp-customer-info-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; transition: all 0.3s ease; }
  .pp-customer-info-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .pp-customer-info-item i { color: #f37121; width: 20px; text-align: center; }
  .pp-payment-form-container { background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .pp-form-title { margin-bottom: 25px; position: relative; padding-bottom: 10px; color: #333; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
  .pp-form-icon { color: #f37121; }
  .pp-form-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background-color: #f37121; }
  .pp-form-group { display: flex; flex-direction: column; gap: 8px; }
  .pp-form-group label { font-weight: 500; color: #333; display: flex; align-items: center; gap: 5px; }
  .pp-required { color: #f37121; }
  .pp-form-group input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; }
  .pp-form-group input:focus { outline: none; border-color: #f37121; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
  .pp-error-message { color: #f37121; font-size: 0.85rem; margin-top: 5px; }
  .pp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pp-cashfree-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05); }
  .pp-cashfree-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
  .pp-cashfree-logo-img { height: 90px; width: 90px; }
  .pp-cashfree-logo span { font-size: 1.2rem; font-weight: 600; color: #072654; }
  .pp-payment-methods-supported { margin-top: 15px; border-top: 1px solid #e0e0e0; padding-top: 15px; }
  .pp-payment-methods-supported p { margin-bottom: 15px; font-weight: 500; color: #333; }
  .pp-payment-icons { display: flex; flex-wrap: wrap; gap: 15px; }
  .pp-payment-icon { display: flex; flex-direction: column; align-items: center; gap: 5px; transition: all 0.3s ease; }
  .pp-payment-icon i { font-size: 1.5rem; color: #fff; background-color: #f37121; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(14, 165, 233, 0.2); transition: all 0.3s ease; }
  .pp-payment-icon:hover i { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .pp-payment-icon span { font-size: 0.8rem; color: #666; }
  .pp-secure-payment-info { display: flex; align-items: center; gap: 15px; background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f37121; }
  .pp-secure-payment-info i { color: #f37121; font-size: 2rem; }
  .pp-secure-payment-info h4 { margin: 0 0 5px 0; color: #0c4a6e; }
  .pp-secure-payment-info p { color: #0c4a6e; font-size: 0.95rem; margin: 0; }
  .pp-form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; gap: 20px; }
  .pp-back-link { background-color: #f8f9fa; color: #666; border: 1px solid #ddd; padding: 12px 20px; border-radius: 8px; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; }
  .pp-back-link:hover { background-color: #e9ecef; color: #333; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .pp-back-link i { transition: transform 0.3s ease; }
  .pp-back-link:hover i { transform: translateX(-3px); }
  .pp-view-details-button { display: flex; align-items: center; justify-content: center; gap: 8px; background-color: #f37121; color: white; border: none; border-radius: 4px; padding: 8px 12px; margin-top: 15px; width: 100%; cursor: pointer; transition: all 0.3s ease; font-weight: 500; }
  .pp-view-details-button:hover { background-color: #2563eb; transform: translateY(-2px); box-shadow: 0 3px 10px rgba(14, 165, 233, 0.3); }
  .pp-pay-button { background-color: #f37121; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }
  .pp-pay-button::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transition: all 0.5s ease; }
  .pp-pay-button:hover:not(:disabled) { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .pp-pay-button:hover::before { left: 100%; }
  .pp-pay-button:disabled { background-color: #ccc; cursor: not-allowed; }
  .pp-body-blur { overflow: hidden; }
  .pp-body-blur::after { content: ""; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); z-index: 9998; }
  .pp-centered-loader-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 9999; }
  .pp-centered-loader-container { background-color: white; padding: 30px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); max-width: 90%; width: 300px; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; }
  .pp-centered-loader-spinner { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; position: relative; }
  .pp-spinner-inner { width: 60px; height: 60px; border: 4px solid transparent; border-top-color: #f37121; border-radius: 50%; animation: pp-spin 1s linear infinite; }
  .pp-centered-loader-container p { color: #333; font-weight: 500; margin: 0; }
  @keyframes pp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .pp-payment-success { background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center; max-width: 600px; margin: 40px auto; animation: pp-fadeIn 0.5s ease; }
  @keyframes pp-fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .pp-success-icon { font-size: 5rem; color: #28a745; margin-bottom: 20px; animation: pp-pulse 2s infinite; }
  @keyframes pp-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .pp-payment-success h2 { margin-bottom: 20px; color: #333; font-size: 2rem; }
  .pp-payment-success p { margin-bottom: 15px; color: #666; font-size: 1.1rem; }
  .pp-payment-success strong { color: #f37121; font-size: 1.2rem; background-color: #f8f9fa; padding: 5px 10px; border-radius: 4px; }
  .pp-success-actions { display: flex; justify-content: center; gap: 20px; margin-top: 30px; }
  .pp-home-button, .pp-browse-button { padding: 12px 24px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; }
  .pp-home-button { background-color: #f37121; color: white; border: none; }
  .pp-home-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .pp-browse-button { background-color: transparent; color: #333; border: 1px solid #ddd; }
  .pp-browse-button:hover { background-color: #f8f9fa; border-color: #ccc; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .pp-loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; }
  .pp-loading-spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #f37121; border-radius: 50%; animation: pp-spin 1s linear infinite; }
  .pp-customer-details-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .pp-modal-content { background-color: white; border-radius: 12px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: pp-modalFadeIn 0.3s ease; }
  @keyframes pp-modalFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .pp-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
  .pp-modal-header h3 { margin: 0; color: #333; font-size: 1.3rem; display: flex; align-items: center; gap: 10px; }
  .pp-modal-header h3 i { color: #f37121; }
  .pp-modal-close { background: none; border: none; font-size: 1.2rem; color: #666; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; }
  .pp-modal-close:hover { background-color: #f8f9fa; color: #f37121; }
  .pp-modal-body { padding: 20px; }
  .pp-traveler-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .pp-traveler-card { border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; }
  .pp-traveler-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15); }
  .pp-primary-traveler { border-left: 4px solid #f37121; }
  .pp-traveler-card-header { background-color: #f8f9fa; padding: 15px; display: flex; align-items: center; gap: 10px; }
  .pp-traveler-card-header i { color: #f37121; font-size: 1.2rem; }
  .pp-traveler-card-header h4 { margin: 0; color: #333; font-size: 1.1rem; }
  .pp-traveler-card-body { padding: 15px; }
  .pp-traveler-detail { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
  .pp-traveler-detail:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .pp-traveler-detail i { color: #f37121; width: 20px; text-align: center; }
  .pp-animated-success-icon { animation: successPulse 1.5s ease-in-out infinite; color: #27ae60; font-size: 4rem; margin-bottom: 20px; }
  @keyframes successPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
  .pp-payment-header { background-color: #e53935; }
  .pp-summary-icon, .pp-form-icon, .pp-customer-icon { color: #e53935; }
  .pp-total { border-color: #e53935; color: #e53935; }
  .pp-pay-button, .pp-home-button, .pp-browse-button { background-color: #e53935; }
  .pp-pay-button:hover, .pp-home-button:hover, .pp-browse-button:hover { background-color: #c62828; }
  .pp-centered-loader-spinner { border-top-color: #e53935; }
  @media (max-width: 768px) { .pp-traveler-cards { grid-template-columns: 1fr; } .pp-modal-content { width: 95%; } }
  @media (max-width: 992px) { .pp-payment-container { grid-template-columns: 1fr; } .pp-order-summary { position: static; margin-bottom: 30px; } }
  @media (max-width: 768px) { .pp-payment-header { padding: 40px 0; } .pp-payment-container { margin: 30px 0; } .pp-order-summary, .pp-payment-form-container { padding: 0; } .pp-payment-form-container { padding: 20px; } .pp-summary-title, .pp-form-title { font-size: 1.3rem; margin-bottom: 15px; } .pp-form-row { grid-template-columns: 1fr; gap: 15px; } .pp-form-group input { padding: 10px 12px; font-size: 0.9rem; } .pp-form-actions { flex-direction: column; gap: 15px; } .pp-back-link, .pp-pay-button { width: 100%; justify-content: center; font-size: 0.95rem; padding: 11px 20px; } .pp-payment-success { padding: 30px 20px; } .pp-payment-success h2 { font-size: 1.5rem; } .pp-success-actions { flex-direction: column; gap: 15px; } .pp-home-button, .pp-browse-button { width: 100%; justify-content: center; padding: 10px; font-size: 0.9rem; } .pp-payment-icons { justify-content: center; } .pp-customer-info-item { word-break: break-all; } .pp-summary-value { word-break: break-word; text-align: right; } }
  @media (max-width: 576px) { .pp-payment-header { padding: 30px 0; } .pp-page-title { font-size: 1.6rem; } .pp-page-subtitle { font-size: 0.85rem; } .pp-summary-details, .pp-customer-details { padding: 15px; } .pp-summary-item { font-size: 0.85rem; padding-bottom: 12px; margin-bottom: 12px; } .pp-summary-item.pp-total .pp-summary-label, .pp-summary-item.pp-total .pp-summary-value { font-size: 1.1rem; } .pp-secure-payment-info { padding: 12px; font-size: 0.85rem; flex-direction: column; text-align: center; gap: 8px; } .pp-secure-payment-info i { font-size: 1.6rem; } .pp-cashfree-logo-img { height: 60px; width: 60px; } .pp-cashfree-logo span { font-size: 1.1rem; } .pp-payment-icon i { width: 40px; height: 40px; font-size: 1.2rem; } }
  @media (max-width: 375px) { .pp-payment-container { margin: 15px 0; } .pp-summary-details, .pp-customer-details, .pp-payment-form-container { padding: 12px; } .pp-cashfree-logo-img { height: 50px; width: 50px; } .pp-cashfree-logo span { font-size: 1rem; } .pp-payment-icons { gap: 10px; } .pp-payment-icon i { width: 36px; height: 36px; font-size: 1.05rem; } .pp-payment-icon span { font-size: 0.75rem; } }
`
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import { apiEndpoints } from "../config/api"
import SEOHead from "../components/SEOHead"

function PaymentPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Get booking details from location state with sessionStorage fallback
  const [bookingDetails] = useState(() => {
    if (location.state?.bookingDetails) {
      return location.state.bookingDetails
    }
    try {
      const stored = sessionStorage.getItem(`bookingDetails_${id}`)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  })

  const [packageDetails] = useState(() => {
    if (location.state?.packageDetails) {
      return location.state.packageDetails
    }
    try {
      const stored = sessionStorage.getItem(`packageDetails_${id}`)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  })

  const [totalPrice] = useState(() => {
    if (location.state?.totalPrice !== undefined) {
      return location.state.totalPrice
    }
    try {
      const stored = sessionStorage.getItem(`totalPrice_${id}`)
      return stored ? JSON.parse(stored) : 0
    } catch (e) {
      return 0
    }
  })

  // Payment status
  const [paymentStatus, setPaymentStatus] = useState({
    processing: false,
    success: false,
    error: false,
    message: "",
  })

  // Toast notification
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("info")

  // Booking reference
  const [bookingReference, setBookingReference] = useState("")

  // Add state for customer details modal
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)

  // Add state to track if we're redirecting to payment gateway
  const [redirectingToGateway, setRedirectingToGateway] = useState(false)

  // Add toggleCustomerDetails function
  const toggleCustomerDetails = () => {
    setShowCustomerDetails(!showCustomerDetails)
  }

  // Function to verify payment after redirect
  const verifyPaymentFromRedirect = useCallback(async (orderId) => {
    document.body.classList.add("pp-body-blur")
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Verifying payment...",
    })

    try {
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/verify-payment")}/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] Payment verification error:", data)
        document.body.classList.remove("pp-body-blur")
        throw new Error("Payment verification failed")
      }

      // Check payment status
      if (data.status === "PAID") {
        // Generate a booking reference if not already set
        setBookingReference((prev) => prev || `TP${id}B${Math.floor(Math.random() * 10000)}`)

        // Store booking and package details in sessionStorage for receipt email
        if (bookingDetails && packageDetails) {
          console.log("[v0] Storing booking details in sessionStorage before redirect")
          sessionStorage.setItem("currentPackageId", id)
          sessionStorage.setItem(`bookingDetails_${id}`, JSON.stringify(bookingDetails))
          sessionStorage.setItem(`packageDetails_${id}`, JSON.stringify(packageDetails))
          sessionStorage.setItem(`totalPrice_${id}`, JSON.stringify(totalPrice))
        }

        // Payment verified successfully
        document.body.classList.remove("pp-body-blur")
        setPaymentStatus({
          processing: false,
          success: true,
          error: false,
          message: "Payment successful! Your booking is confirmed.",
        })

        setToastMessage("Payment successful! Your booking is confirmed.")
        setToastType("success")
        setShowToast(true)

        // Add URL parameters with booking and package details
        const bookingDataParam = encodeURIComponent(JSON.stringify(bookingDetails))
        const packageDataParam = encodeURIComponent(JSON.stringify(packageDetails))

        // Redirect to payment status page after a short delay
        setTimeout(() => {
          navigate(
            `/payment-status?order_id=${orderId}&bookingData=${bookingDataParam}&packageData=${packageDataParam}`,
          )
        }, 1500)
      } else {
        // Payment not successful
        document.body.classList.remove("pp-body-blur")
        setPaymentStatus({
          processing: false,
          success: false,
          error: true,
          message: `Payment not successful. Status: ${data.status}`,
        })

        setToastMessage(`Payment not successful. Status: ${data.status}`)
        setToastType("error")
        setShowToast(true)
      }
    } catch (error) {
      console.error("[v0] Error verifying payment:", error)
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Payment verification failed. Please contact support.",
      })

      setToastMessage("Payment verification failed. Please contact support.")
      setToastType("error")
      setShowToast(true)
    }
  }, [id, bookingDetails, packageDetails, totalPrice, navigate])

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Redirect if no booking details
    if (!bookingDetails || !packageDetails) {
      navigate(`/package/${id}`)
      return
    }

    // Check if we're coming back from payment gateway (detect browser back button)
    const isReturningFromGateway = redirectingToGateway

    // If we're returning from payment gateway, reset the payment status
    if (isReturningFromGateway) {
      console.log("Detected return from payment gateway, resetting payment status")
      setRedirectingToGateway(false)
      setPaymentStatus({
        processing: false,
        success: false,
        error: false,
        message: "",
      })
      document.body.classList.remove("pp-body-blur")
    }

    // Check for payment success in URL parameters (for return from Cashfree)
    const urlParams = new URLSearchParams(window.location.search)
    const orderId = urlParams.get("order_id")

    if (orderId) {
      verifyPaymentFromRedirect(orderId)
    }

    return () => {
      // Make sure to remove the blur class when component unmounts
      document.body.classList.remove("pp-body-blur")
    }
  }, [bookingDetails, packageDetails, id, navigate, redirectingToGateway, verifyPaymentFromRedirect])

  // Add event listener for popstate (back button)
  useEffect(() => {
    const handlePopState = () => {
      // Reset payment status when user navigates back
      setPaymentStatus({
        processing: false,
        success: false,
        error: false,
        message: "",
      })
      document.body.classList.remove("pp-body-blur")
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Update the createCashfreeOrder function to show a better loader
  const createCashfreeOrder = async () => {
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Creating payment order...",
    })

    try {
      // Generate a booking reference
      const bookingRef = `TP${id}B${Math.floor(Math.random() * 10000)}`
      setBookingReference(bookingRef)

      // Create order on your server
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/create-order")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
            currency: "INR",
            customerDetails: {
              customer_id: `cust_${Date.now()}`,
              customer_name: bookingDetails.fullName,
              customer_email: bookingDetails.email,
              customer_phone: bookingDetails.phone,
            },
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] Server error details:", data)
        document.body.classList.remove("pp-body-blur")
        throw new Error(data.message || "Failed to create order")
      }

      return data
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Failed to create payment order. Please try again.",
      })

      setToastMessage("Failed to create payment order. Please try again.")
      setToastType("error")
      setShowToast(true)

      return null
    }
  }

  // Function to handle payment initiation
  const handlePayment = async () => {
    // Show the loader immediately when Pay Now is clicked
    document.body.classList.add("pp-body-blur")
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Preparing your payment...",
    })

    // Store the current package ID in sessionStorage
    sessionStorage.setItem("currentPackageId", id)

    // Store booking and package details in sessionStorage as backup
    sessionStorage.setItem(`bookingDetails_${id}`, JSON.stringify(bookingDetails))
    sessionStorage.setItem(`packageDetails_${id}`, JSON.stringify(packageDetails))
    sessionStorage.setItem(`totalPrice_${id}`, JSON.stringify(totalPrice))

    // Create Cashfree order
    const orderData = await createCashfreeOrder()

    if (!orderData) {
      document.body.classList.remove("pp-body-blur")
      return
    }

    // Set redirecting flag before redirecting to payment gateway
    setRedirectingToGateway(true)

    // Initialize Cashfree checkout using the correct method
    // The SDK exposes Cashfree as a global variable with different methods
    if (window.Cashfree) {
      const cf = new window.Cashfree(orderData.payment_session_id)

      // Add booking and package data to the return URL
      const bookingDataParam = encodeURIComponent(JSON.stringify(bookingDetails))
      const packageDataParam = encodeURIComponent(JSON.stringify(packageDetails))

      // Set callback functions
      cf.redirect({
        params: {
          bookingData: bookingDataParam,
          packageData: packageDataParam,
        },
      })
    } else {
      console.error("Cashfree SDK not loaded")
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Payment gateway not available. Please try again later.",
      })

      setToastMessage("Payment gateway not available. Please try again later.")
      setToastType("error")
      setShowToast(true)

      // Reset redirecting flag if there's an error
      setRedirectingToGateway(false)
    }
  }

  if (!bookingDetails || !packageDetails) {
    return (
      <div className="pp-loading-container">
        <div className="pp-loading-spinner"></div>
        <p>Loading payment page...</p>
      </div>
    )
  }

  return (
    <div className="pp-payment-page">
      <style dangerouslySetInnerHTML={{ __html: paymentStyles }} />
      <SEOHead
        title={`Complete Payment | Pratham Tours`}
        description={`Complete secure payment checkout online for your booking of ${packageDetails ? packageDetails.name : "travel package"}.`}
        keywords="payment, secure payment, cashfree, checkout page, booking payment, Pratham Tours"
        canonical={`https://prathamtours.com/payment/${id}`}
      />
      {/* Updated header with inline background image */}
      <div 
        className="pp-payment-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/hero/payment-header.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="pp-page-title">Payment</h1>
            <p className="pp-page-subtitle">Complete your booking for {packageDetails.name}</p>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        {paymentStatus.success ? (
          <div className="pp-payment-success">
            <div className="pp-success-icon pp-animated-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your payment of ₹{totalPrice.toLocaleString("en-IN")} has been processed successfully.</p>
            <p>A confirmation email has been sent to {bookingDetails.email}.</p>
            <p>
              Your booking reference: <strong>{bookingReference}</strong>
            </p>
            <div className="pp-success-actions">
              <Link to="/" className="pp-home-button">
                <i className="fas fa-home"></i> Return to Home
              </Link>
              <Link to="/packages" className="pp-browse-button">
                <i className="fas fa-search"></i> Browse More Packages
              </Link>
            </div>
          </div>
        ) : (
          <div className="pp-payment-container">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="pp-order-summary">
                <div className="pp-order-summary-header">
                  <i className="fas fa-receipt pp-summary-icon"></i>
                  <h2 className="pp-summary-title">Order Summary</h2>
                </div>
                <div className="pp-summary-details">
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-map-marked-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Package:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.name}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-map-marker-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Destination:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.location}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-calendar-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Duration:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.duration} Days</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-calendar-day pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Travel Date:</span>
                    </div>
                    <span className="pp-summary-value">{bookingDetails.travelDate}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-users pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Travelers:</span>
                    </div>
                    <span className="pp-summary-value">{bookingDetails.travelers}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-tag pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Price per person:</span>
                    </div>
                    <span className="pp-summary-value">₹{packageDetails.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="pp-summary-item pp-total">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-money-bill-wave pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Total Amount:</span>
                    </div>
                    <span className="pp-summary-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pp-customer-details">
                  <h3>
                    <i className="fas fa-user-circle pp-customer-icon"></i> Customer Details
                  </h3>
                  <div className="pp-customer-info">
                    <div className="pp-customer-info-item">
                      <i className="fas fa-user"></i>
                      <span>{bookingDetails.fullName}</span>
                    </div>
                    <div className="pp-customer-info-item">
                      <i className="fas fa-envelope"></i>
                      <span>{bookingDetails.email}</span>
                    </div>
                    <div className="pp-customer-info-item">
                      <i className="fas fa-phone"></i>
                      <span>{bookingDetails.phone}</span>
                    </div>
                    <button className="pp-view-details-button" onClick={toggleCustomerDetails}>
                      <i className="fas fa-users"></i> View All Travelers
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="pp-payment-form-container">
                <h2 className="pp-form-title">
                  <i className="fas fa-credit-card pp-form-icon"></i> Payment Method
                </h2>

                <div className="pp-cashfree-info">
                  <div className="pp-cashfree-logo">
                    <img src="/assets/logos/cashfree-logo.png" alt="Cashfree" className="pp-cashfree-logo-img" /> {/* Updated path */}
                    <span>Cashfree Payments</span>
                  </div>
                  <p>
                    Secure payments powered by Cashfree. You'll be redirected to Cashfree's secure payment page to
                    complete your transaction.
                  </p>
                  <div className="pp-payment-methods-supported">
                    <p>Supported payment methods:</p>
                    <div className="pp-payment-icons">
                      <div className="pp-payment-icon">
                        <i className="fas fa-credit-card" title="Credit/Debit Cards"></i>
                        <span>Cards</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-mobile-alt" title="UPI"></i>
                        <span>UPI</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-university" title="Net Banking"></i>
                        <span>Net Banking</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-wallet" title="Wallets"></i>
                        <span>Wallets</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pp-secure-payment-info">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>Your payment information is secure. We use industry-standard encryption to protect your data.</p>
                  </div>
                </div>

                <div className="pp-form-actions">
                  <Link to={`/booking/${id}`} className="pp-back-link">
                    <i className="fas fa-arrow-left"></i> Back to Booking
                  </Link>
                  <button
                    type="button"
                    className="pp-pay-button"
                    onClick={handlePayment}
                    disabled={paymentStatus.processing}
                  >
                    {paymentStatus.processing ? "Processing..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
                    {!paymentStatus.processing && <i className="fas fa-lock"></i>}
                  </button>
                </div>
              </div>
            </AnimatedElement>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}

      {/* Centered loader overlay */}
      {paymentStatus.processing && (
        <div className="pp-centered-loader-overlay">
          <div className="pp-centered-loader-container">
            <div className="pp-centered-loader-spinner">
              <div className="pp-spinner-inner"></div>
            </div>
            <p>{paymentStatus.message}</p>
          </div>
        </div>
      )}

      {showCustomerDetails && (
        <div className="pp-customer-details-modal">
          <div className="pp-modal-content">
            <div
              className="pp-modal-header"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 10,
              }}
            >
              <h3>
                <i className="fas fa-users"></i> All Travelers
              </h3>
              <button className="pp-modal-close" onClick={toggleCustomerDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pp-modal-body">
              <div className="pp-traveler-cards">
                {/* Primary Traveler Card - Show all details except travel date */}
                <div className="pp-traveler-card pp-primary-traveler">
                  <div className="pp-traveler-card-header">
                    <i className="fas fa-user-circle"></i>
                    <h4>Primary Traveler</h4>
                  </div>
                  <div className="pp-traveler-card-body">
                    <div className="pp-traveler-detail">
                      <i className="fas fa-user"></i>
                      <span>{bookingDetails.fullName}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-envelope"></i>
                      <span>{bookingDetails.email}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-phone"></i>
                      <span>{bookingDetails.phone}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-venus-mars"></i>
                      <span>{bookingDetails.gender}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-birthday-cake"></i>
                      <span>{bookingDetails.age} years</span>
                    </div>
                  </div>
                </div>

                {/* Additional Travelers Cards - Show only name, gender and age */}
                {bookingDetails.additionalTravelers &&
                  bookingDetails.additionalTravelers.map((traveler, index) => (
                    <div key={index} className="pp-traveler-card">
                      <div className="pp-traveler-card-header">
                        <i className="fas fa-user"></i>
                        <h4>Traveler {index + 2}</h4>
                      </div>
                      <div className="pp-traveler-card-body">
                        <div className="pp-traveler-detail">
                          <i className="fas fa-user"></i>
                          <span>{traveler.fullName}</span>
                        </div>
                        <div className="pp-traveler-detail">
                          <i className="fas fa-venus-mars"></i>
                          <span>{traveler.gender}</span>
                        </div>
                        <div className="pp-traveler-detail">
                          <i className="fas fa-birthday-cake"></i>
                          <span>{traveler.age} years</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentPage