import { useState, useEffect, useRef } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import ReceiptTemplate from "../components/ReceiptTemplate"
import { apiEndpoints } from "../config/api"
import SEOHead from "../components/SEOHead"

const statusStyles = `
  .ps-payment-status-container { padding: 40px 0; min-height: 80vh; display: flex; flex-direction: column; align-items: center; background-color: #f8f9fa; }
  .ps-loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; }
  .ps-loading-spinner { width: 50px; height: 50px; border: 5px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #e53935; animation: spin 1s ease-in-out infinite; margin-bottom: 20px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ps-status-card { background-color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); padding: 30px; width: 100%; max-width: 700px; text-align: center; margin: 0 auto; }
  .ps-status-card.ps-success { border-top: 5px solid #28a745; }
  .ps-status-card.ps-error { border-top: 5px solid #dc3545; }
  .ps-status-icon { font-size: 60px; margin-bottom: 20px; }
  .ps-status-card.ps-success .ps-status-icon { color: #28a745; }
  .ps-status-card.ps-error .ps-status-icon { color: #dc3545; }
  .ps-status-title { font-size: 28px; margin-bottom: 15px; font-weight: 700; }
  .ps-status-message { font-size: 18px; color: #666; margin-bottom: 25px; }
  .ps-order-details { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left; }
  .ps-order-details h3 { font-size: 20px; margin-bottom: 15px; color: #333; display: flex; align-items: center; }
  .ps-details-icon { margin-right: 10px; color: #e53935; }
  .ps-details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
  .ps-detail-item { display: flex; flex-direction: column; background-color: white; padding: 12px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); }
  .ps-detail-label { font-size: 14px; color: #666; margin-bottom: 5px; display: flex; align-items: center; }
  .ps-detail-label i { margin-right: 8px; color: #e53935; }
  .ps-detail-value { font-size: 16px; font-weight: 600; color: #333; }
  .ps-status-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 14px; font-weight: 600; background-color: #28a745; color: white; }
  .ps-action-buttons { display: flex; justify-content: center; gap: 15px; margin-top: 30px; flex-wrap: wrap; }
  .ps-home-button, .ps-retry-button, .ps-download-button { padding: 12px 24px; border-radius: 50px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; cursor: pointer; text-decoration: none; }
  .ps-home-button { background-color: #e53935; color: white; border: none; }
  .ps-home-button:hover { background-color: #c62828; }
  .ps-retry-button { background-color: #dc3545; color: white; border: none; }
  .ps-retry-button:hover { background-color: #c82333; }
  .ps-download-button { background-color: #28a745; color: white; border: none; }
  .ps-download-button:hover { background-color: #218838; }
  .ps-home-button i, .ps-retry-button i, .ps-download-button i { margin-right: 8px; }
  .ps-receipt-info { margin: 20px 0; padding: 15px; background-color: #ffebee; border-radius: 8px; color: #c62828; font-size: 16px; }
  .ps-receipt-info i { margin-right: 8px; }
  .ps-receipt-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .ps-receipt-modal-content { background-color: white; border-radius: 10px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
  .ps-receipt-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #e0e0e0; position: sticky; top: 0; background-color: white; z-index: 10; }
  .ps-receipt-modal-header h3 { margin: 0; font-size: 20px; }
  .ps-modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #666; }
  .ps-receipt-modal-body { padding: 20px; }
  .ps-receipt-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 15px 20px; border-top: 1px solid #e0e0e0; position: sticky; bottom: 0; background-color: white; }
  .ps-print-button { padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .ps-print-button:hover { background-color: #5a6268; }
  .ps-ticket-info { background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; display: flex; align-items: center; border-radius: 4px; }
  .ps-ticket-info i { font-size: 24px; color: #ffc107; margin-right: 15px; }
  .ps-ticket-info p { margin: 0; color: #5d4037; font-size: 15px; }
  .ps-email-progress-container { width: 100%; height: 8px; background-color: #f1f1f1; border-radius: 4px; margin-bottom: 10px; overflow: hidden; position: relative; }
  .ps-email-progress-bar { height: 100%; background: linear-gradient(90deg, #27ae60, #2ecc71); border-radius: 4px; transition: width 0.5s ease; box-shadow: 0 0 10px rgba(46, 204, 113, 0.5); position: relative; overflow: hidden; }
  .ps-email-progress-bar::after { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%); animation: shimmer 1.5s infinite; }
  .ps-email-progress-percentage { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: bold; color: #333; }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  .ps-email-sending-fullscreen { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100%; background-color: white; position: fixed; top: 0; left: 0; z-index: 1000; }
  .ps-email-sending-fullscreen .ps-email-progress-container { width: 300px; height: 12px; background-color: #f1f1f1; border-radius: 6px; margin: 20px 0; overflow: hidden; position: relative; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
  .ps-email-sending-fullscreen .ps-email-progress-bar { height: 100%; background: linear-gradient(90deg, #27ae60, #2ecc71); border-radius: 6px; transition: width 0.5s ease; box-shadow: 0 0 15px rgba(46, 204, 113, 0.5); position: relative; overflow: hidden; }
  .ps-email-sending-fullscreen .ps-email-progress-bar::after { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%); animation: shimmer 1.5s infinite; }
  .ps-email-sending-fullscreen .ps-email-progress-percentage { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: bold; color: #333; }
  .ps-email-message { margin-top: 15px; text-align: center; }
  .ps-email-message p { font-size: 18px; color: #333; font-weight: 500; margin: 5px 0; animation: fadeInOut 2s ease-in-out infinite; }
  @keyframes fadeInOut { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
  .ps-email-animation-container { margin-bottom: 30px; position: relative; width: 120px; height: 120px; }
  .ps-email-icon { position: relative; width: 100%; height: 100%; }
  .ps-envelope { position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; animation: bounce 2s infinite; }
  .ps-envelope-body { position: absolute; width: 100%; height: 80%; bottom: 0; background-color: #e53935; border-radius: 5px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
  .ps-envelope-top { position: absolute; width: 100%; height: 40%; top: 0; border-top: 40px solid #c62828; border-left: 60px solid transparent; border-right: 60px solid transparent; box-sizing: border-box; transform-origin: top; animation: flapOpen 4s infinite; }
  .ps-envelope-paper { position: absolute; width: 80%; height: 70%; background-color: white; top: 15%; left: 10%; border-radius: 3px; z-index: -1; transform: translateY(0); animation: paperSlide 4s infinite; }
  .ps-email-waves { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 100%; height: 40px; }
  .ps-wave { position: absolute; height: 8px; border-radius: 50%; background: rgba(229, 57, 53, 0.3); animation: wave 2s infinite; opacity: 0; }
  .ps-wave1 { width: 30px; bottom: 0; animation-delay: 0s; }
  .ps-wave2 { width: 60px; bottom: 10px; animation-delay: 0.2s; }
  .ps-wave3 { width: 90px; bottom: 20px; animation-delay: 0.4s; }
  @keyframes wave { 0% { transform: scale(0); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
  @keyframes flapOpen { 0%, 30%, 70%, 100% { transform: rotateX(0deg); } 40%, 60% { transform: rotateX(-60deg); } }
  @keyframes paperSlide { 0%, 30% { transform: translateY(0); } 40%, 55% { transform: translateY(-30px); } 60%, 100% { transform: translateY(0); } }
  .ps-animated-success { animation: successPulse 1.5s ease-in-out infinite; color: #27ae60; font-size: 3.5rem; }
  @keyframes successPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
  @media (max-width: 768px) { .ps-status-card { padding: 20px; width: 95%; } .ps-details-grid { grid-template-columns: 1fr; } .ps-action-buttons { flex-direction: column; gap: 12px; } .ps-home-button, .ps-retry-button, .ps-download-button { width: 100%; padding: 11px 20px; font-size: 15px; } .ps-detail-value { word-break: break-all; } }
  @media (max-width: 576px) { .ps-payment-status-container { padding: 20px 0; } .ps-status-card { padding: 15px; border-radius: 8px; } .ps-status-icon { font-size: 45px; margin-bottom: 15px; } .ps-status-title { font-size: 20px; margin-bottom: 10px; } .ps-status-message { font-size: 15px; margin-bottom: 20px; } .ps-order-details { padding: 15px; margin: 15px 0; } .ps-order-details h3 { font-size: 17px; margin-bottom: 12px; } .ps-detail-item { padding: 10px; } .ps-detail-label { font-size: 13px; } .ps-detail-value { font-size: 14px; } .ps-receipt-info { font-size: 14px; padding: 12px; margin: 15px 0; } .ps-email-sending-fullscreen .ps-email-progress-container { width: 90%; max-width: 280px; } .ps-email-message p { font-size: 16px; } }
  @media (max-width: 375px) { .ps-status-card { padding: 12px; width: 98%; } .ps-status-title { font-size: 18px; } .ps-status-message { font-size: 14px; } .ps-order-details h3 { font-size: 15px; } .ps-home-button, .ps-retry-button, .ps-download-button { padding: 10px 16px; font-size: 14px; } }
  @media print { .ps-receipt-modal-header, .ps-receipt-modal-footer, .ps-action-buttons, .ps-status-icon, .ps-status-title, .ps-status-message, .ps-receipt-info, .ps-print-button { display: none !important; } .ps-receipt-modal { position: absolute; background: none; } .ps-receipt-modal-content { box-shadow: none; max-height: none; } .ps-receipt-modal-body { padding: 0; } }
`
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import ReceiptTemplate from "../components/ReceiptTemplate"
import { apiEndpoints } from "../config/api"
import SEOHead from "../components/SEOHead"

// Dynamic script loader helper for html2pdf.js
const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf)
      return
    }
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"
    script.crossOrigin = "anonymous"
    script.referrerPolicy = "no-referrer"
    script.onload = () => resolve(window.html2pdf)
    script.onerror = (err) => reject(err)
    document.body.appendChild(script)
  })
}

function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get("order_id")

  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState({
    loading: true,
    success: false,
    error: false,
    message: "",
    orderDetails: null,
  })

  // Booking details state
  const [bookingDetails, setBookingDetails] = useState(null)
  const [packageDetails, setPackageDetails] = useState(null)

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptSent, setReceiptSent] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSendProgress, setEmailSendProgress] = useState(0) // Add progress state for loader
  const [serverStatus, setServerStatus] = useState(true) // Track server connection status
  const [isEmailSendingComplete, setIsEmailSendingComplete] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Preparing your receipt...") // Dynamic loading message

  // Toast notification
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("info")

  // Add this at the top of the component with other state variables
  const [bookingSaved, setBookingSaved] = useState(false)

  // Add this new state variable to prevent duplicate payment verification
  const [paymentVerified, setPaymentVerified] = useState(false)

  // Use a ref to track if the effect has run
  const effectRan = useRef(false)

  // Check if server is running
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/ha")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setServerStatus(true)
        return true
      } else {
        setServerStatus(false)
        return false
      }
    } catch (error) {
      console.error("[v0] Server connection error:", error)
      setServerStatus(false)
      return false
    }
  }

  // Function to format date and time separately
  const formatDateOnly = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    // In development, React.StrictMode causes effects to run twice
    // This check ensures we only run our main logic once
    if (effectRan.current === true && import.meta.env.MODE !== "production") {
      return
    }

    effectRan.current = true

    // Check server status first
    checkServerStatus().then((isServerRunning) => {
      if (!isServerRunning) {
        setToastMessage("Server connection error. Please make sure the server is running.")
        setToastType("error")
        setShowToast(true)
      }

      // Verify payment if order ID exists and hasn't been verified yet
      if (orderId && !paymentVerified) {
        verifyPayment()

        // Try to retrieve booking details from sessionStorage
        try {
          // Get the package ID from sessionStorage if available
          const storedPackageId = sessionStorage.getItem("currentPackageId")

          if (storedPackageId) {
            const storedBookingDetails = JSON.parse(sessionStorage.getItem(`bookingDetails_${storedPackageId}`))
            const storedPackageDetails = JSON.parse(sessionStorage.getItem(`packageDetails_${storedPackageId}`))

            if (storedBookingDetails) setBookingDetails(storedBookingDetails)
            if (storedPackageDetails) setPackageDetails(storedPackageDetails)
          } else {
            // Try to get booking details from URL state if available
            const urlParams = new URLSearchParams(window.location.search)
            const bookingDataParam = urlParams.get("bookingData")
            const packageDataParam = urlParams.get("packageData")

            if (bookingDataParam && packageDataParam) {
              try {
                setBookingDetails(JSON.parse(decodeURIComponent(bookingDataParam)))
                setPackageDetails(JSON.parse(decodeURIComponent(packageDataParam)))
              } catch (err) {
                console.error("Error parsing URL parameters", err)
              }
            }
          }
        } catch (err) {
          console.error("Error retrieving booking details from sessionStorage", err)
        }
      } else if (!orderId) {
        setPaymentStatus({
          loading: false,
          success: false,
          error: true,
          message: "No order ID found",
          orderDetails: null,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]) // We're intentionally excluding paymentVerified and verifyPayment from dependencies

  // FIXED: Modified the saveBookingToDatabase function to use correct data structure
  const saveBookingToDatabase = async (orderData, bookingDetailsToSave, packageDetailsToSave) => {
    try {
      // Check if booking has already been saved in this session
      if (bookingSaved) {
        console.log("[v0] Booking already saved in this session, skipping duplicate save")
        return { success: true, alreadyExists: true }
      }

      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      // Use provided details or fall back to state
      const finalOrderData = orderData || (paymentStatus.orderDetails ? paymentStatus.orderDetails : null)
      const finalBookingDetails = bookingDetailsToSave || bookingDetails
      const finalPackageDetails = packageDetailsToSave || packageDetails

      if (!finalOrderData) {
        console.error("Cannot save booking: missing order details")
        return null
      }

      if (!finalBookingDetails || !finalPackageDetails) {
        console.error("Cannot save booking: missing booking or package details")
        return null
      }

      // Set the flag to indicate booking save attempt is in progress - BEFORE the API call
      // This prevents multiple simultaneous calls
      setBookingSaved(true)

      console.log("[v0] Saving booking to database:", {
        orderId: finalOrderData.order_id,
        customerName: finalBookingDetails.fullName,
        packageName: finalPackageDetails.name,
      })

      // Add a unique request ID to help track duplicate requests
      const requestId = Date.now().toString()

      // FIXED: Use the correct endpoint and data structure
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/save-booking")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
          },
          body: JSON.stringify({
            orderData: {
              order_id: finalOrderData.order_id,
              order_amount: finalOrderData.order_amount,
              order_status: finalOrderData.order_status || "PAID",
              payment_time: finalOrderData.payment_time || new Date().toISOString(),
              booking_date: finalOrderData.booking_date || new Date().toISOString(),
            },
            bookingDetails: {
              fullName: finalBookingDetails.fullName,
              email: finalBookingDetails.email,
              phone: finalBookingDetails.phone,
              gender: finalBookingDetails.gender || "Not specified",
              age: finalBookingDetails.age || "Not specified",
              travelDate: finalBookingDetails.travelDate,
              travelers: finalBookingDetails.travelers,
              additionalTravelers: finalBookingDetails.additionalTravelers || [],
              specialRequests: finalBookingDetails.specialRequests || "",
            },
            packageDetails: {
              id: finalPackageDetails.id || finalPackageDetails._id,
              name: finalPackageDetails.name,
              location: finalPackageDetails.location,
              duration: finalPackageDetails.duration,
              price: finalPackageDetails.price,
            },
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        // If the save failed, reset the bookingSaved flag to allow retries
        if (response.status !== 409) {
          // 409 = Conflict, which means it was already saved
          setBookingSaved(false)
        }
        throw new Error(data.message || "Failed to save booking")
      }

      console.log("[v0] Booking saved successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Error saving booking:", error)
      setToastMessage(error.message || "Failed to save booking. Please try again later.")
      setToastType("error")
      setShowToast(true)
      return null
    }
  }

  // Update the verifyPayment function to ensure it only runs once
  const verifyPayment = async () => {
    // Check if payment has already been verified in this session
    if (paymentVerified) {
      console.log("[v0] Payment already verified in this session, skipping duplicate verification")
      return
    }

    // Set flag BEFORE making the request to prevent race conditions
    setPaymentVerified(true)

    let data
    try {
      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/verify-payment")}/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment")
      }

      // Get current date and time for payment time if not available
      const currentDate = new Date()

      // Update payment status based on response with formatted date
      const updatedOrderDetails = {
        ...data.data,
        // Use the payment_time from API if available, otherwise use current date
        payment_time: data.data && data.data.payment_time ? data.data.payment_time : currentDate.toISOString(),
        // Add booking date (using current date as fallback)
        booking_date: data.data && data.data.booking_date ? data.data.booking_date : currentDate.toISOString(),
      }

      setPaymentStatus({
        loading: false,
        success: data.status === "PAID",
        error: data.status !== "PAID",
        message: data.message,
        orderDetails: updatedOrderDetails,
      })

      // If payment is successful, try to retrieve booking details one more time if not already set
      if (data.status === "PAID") {
        // CHECK if receipt has already been sent for this order ID in localStorage
        const hasSentReceipt = localStorage.getItem(`receipt_sent_${orderId}`) === "true"
        if (hasSentReceipt) {
          console.log("[v0] Receipt already sent for this order in a previous session, skipping email and database save.")
          setReceiptSent(true)
          setIsEmailSendingComplete(true)
          setIsSendingEmail(false)
          return
        }

        let localBookingDetails = bookingDetails
        let localPackageDetails = packageDetails

        if (!bookingDetails || !packageDetails) {
          const storedPackageId = sessionStorage.getItem("currentPackageId")
          console.log("Trying to retrieve booking details from sessionStorage with packageId:", storedPackageId)

          if (storedPackageId) {
            try {
              const storedBookingDetails = JSON.parse(sessionStorage.getItem(`bookingDetails_${storedPackageId}`))
              const storedPackageDetails = JSON.parse(sessionStorage.getItem(`packageDetails_${storedPackageId}`))

              console.log("Retrieved from sessionStorage:", {
                hasBookingDetails: !!storedBookingDetails,
                hasPackageDetails: !!storedPackageDetails,
              })

              if (storedBookingDetails) {
                localBookingDetails = storedBookingDetails
                setBookingDetails(storedBookingDetails)
              }
              if (storedPackageDetails) {
                localPackageDetails = storedPackageDetails
                setPackageDetails(storedPackageDetails)
              }
            } catch (err) {
              console.error("Error retrieving booking details from sessionStorage", err)
            }
          } else {
            // Try to get booking details from URL state if available
            const urlParams = new URLSearchParams(window.location.search)
            const bookingDataParam = urlParams.get("bookingData")
            const packageDataParam = urlParams.get("packageData")

            console.log("Trying to retrieve booking details from URL params:", {
              hasBookingParam: !!bookingDataParam,
              hasPackageParam: !!packageDataParam,
            })

            if (bookingDataParam && packageDataParam) {
              try {
                const parsedBookingDetails = JSON.parse(decodeURIComponent(bookingDataParam))
                const parsedPackageDetails = JSON.parse(decodeURIComponent(packageDataParam))

                localBookingDetails = parsedBookingDetails
                localPackageDetails = parsedPackageDetails

                setBookingDetails(parsedBookingDetails)
                setPackageDetails(parsedPackageDetails)
              } catch (err) {
                console.error("Error parsing URL parameters", err)
              }
            }
          }
        }

        // After retrieving booking details, process only if we have all required data
        if (localBookingDetails && localPackageDetails && updatedOrderDetails) {
          // Use a single timeout to prevent multiple calls
          setTimeout(async () => {
            console.log("Processing successful payment with:", {
              hasBookingDetails: !!localBookingDetails,
              hasPackageDetails: !!localPackageDetails,
              hasOrderDetails: !!updatedOrderDetails,
            })

            try {
              // Save booking to database first with the updated order details
              // Use await to ensure we wait for the result before proceeding
              const saveResult = await saveBookingToDatabase(
                updatedOrderDetails,
                localBookingDetails,
                localPackageDetails,
              )

              // Only proceed with email sending if booking was saved or already exists
              if (saveResult && saveResult.success) {
                // Show loader for email sending
                setIsSendingEmail(true)
                setEmailSendProgress(0) // Start progress at 0%
                setIsEmailSendingComplete(false) // Reset email sending state
                setLoadingMessage("Preparing your receipt...") // Initial message

                // Create an array of loading messages to cycle through
                const loadingMessages = [
                  "Preparing your receipt...",
                  "Generating PDF document...",
                  "Adding booking details...",
                  "Formatting your receipt...",
                  "Sending to your email...",
                  "Almost done...",
                ]

                // Start progress animation with message changes
                let messageIndex = 0
                const progressInterval = setInterval(() => {
                  setEmailSendProgress((prev) => {
                    // Increase progress gradually up to 85% (reserve the rest for completion)
                    if (prev < 85) {
                      // Change message every ~20% progress
                      if (prev % 20 === 0 && messageIndex < loadingMessages.length - 1) {
                        messageIndex++
                        setLoadingMessage(loadingMessages[messageIndex])
                      }
                      return prev + 2
                    }
                    return prev
                  })
                }, 120) // Update more frequently for smoother animation

                try {
                  // Send the email
                  await sendReceiptEmail(updatedOrderDetails, localBookingDetails, localPackageDetails)

                  // Clear the interval when done
                  clearInterval(progressInterval)

                  // Set final message
                  setLoadingMessage("Receipt sent successfully!")

                  // Complete the progress
                  setEmailSendProgress(100)

                  // Set email sending complete after a delay to ensure the progress bar completes visually
                  setTimeout(() => {
                    setIsEmailSendingComplete(true)

                    // Show toast only after email is sent
                    setToastMessage("Receipt has been sent to your email")
                    setToastType("success")
                    setShowToast(true)
                  }, 500)
                } catch (emailError) {
                  clearInterval(progressInterval)
                  console.error("Error sending receipt email:", emailError)
                  setIsEmailSendingComplete(true)
                  setToastMessage("Could not send receipt email. Please try again later.")
                  setToastType("error")
                  setShowToast(true)
                }
              } else {
                console.error("Cannot proceed with email: booking save failed")
                setToastMessage("Could not save booking details. Please try again later.")
                setToastType("error")
                setShowToast(true)
              }
            } catch (error) {
              console.error("Error in payment processing:", error)
              setToastMessage("Error processing payment. Please try again later.")
              setToastType("error")
              setShowToast(true)
            }
          }, 1000) // Reduced timeout to 1 second for faster response
        } else if (data.status === "PAID") {
          console.error("Cannot process payment: missing required details")
          setToastMessage("Could not process payment: missing required details")
          setToastType("error")
          setShowToast(true)
        }
      }

      // Only show toast for errors, not for successful verification
      if (data.status !== "PAID") {
        setToastMessage(data.message)
        setToastType("error")
        setShowToast(true)
      }
    } catch (error) {
      // If verification fails, reset the flag to allow retries
      setPaymentVerified(false)

      console.error("Error verifying payment:", error)

      // Get current date and time as fallback
      const currentDate = new Date()
      const currentDateISOString = currentDate.toISOString()

      setPaymentStatus({
        loading: false,
        success: false,
        error: true,
        message: "Failed to verify payment. Please try again later.",
        orderDetails: {
          order_id: orderId || "Unknown",
          order_amount: 0,
          order_status: "FAILED",
          payment_time: currentDateISOString,
          booking_date: currentDateISOString,
        },
      })

      setToastMessage(error.message || "Failed to verify payment. Please try again later.")
      setToastType("error")
      setShowToast(true)
    }
  }

  // Function to send receipt email
  const sendReceiptEmail = async (orderData, bookingDetailsToUse = null, packageDetailsToUse = null) => {
    try {
      // Record the start time to ensure minimum 5 seconds display
      const startTime = Date.now()

      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      // Use provided details or fall back to state
      const finalBookingDetails = bookingDetailsToUse || bookingDetails
      const finalPackageDetails = packageDetailsToUse || packageDetails

      if (!finalBookingDetails || !finalPackageDetails) {
        console.error("Missing booking or package details for receipt email")
        return
      }

      console.log("[v0] Sending receipt email with details:", {
        hasOrderData: !!orderData,
        hasBookingDetails: !!finalBookingDetails,
        hasPackageDetails: !!finalPackageDetails,
      })

      setIsSendingEmail(true)
      setEmailSendProgress(10)

      // Wait a moment for DOM to update and render the hidden receipt template
      await new Promise((resolve) => setTimeout(resolve, 300))
      setEmailSendProgress(30)

      // Generates the PDF base64 client-side
      let pdfBase64 = null
      try {
        const html2pdf = await loadHtml2Pdf()
        const element = document.getElementById("hidden-receipt-pdf")
        if (element) {
          const opt = {
            margin: [10, 10, 10, 10],
            filename: `Pratham Tours_Receipt_${orderData.order_id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
          }
          const pdfDataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring')
          // Extract base64
          pdfBase64 = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1)
          console.log("[v0] PDF generated client-side successfully")
        } else {
          console.error("[v0] Hidden receipt element not found in DOM")
        }
      } catch (pdfGenErr) {
        console.error("[v0] Failed to generate PDF client-side for email attachment:", pdfGenErr)
      }

      setEmailSendProgress(50) // Update progress to 50%

      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/send-receipt")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData,
            bookingDetails: finalBookingDetails,
            packageDetails: finalPackageDetails,
            pdfBase64: pdfBase64, // Send base64 to server!
          }),
        },
      )

      const data = await response.json()

      // Calculate how much time has passed
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 5000 - elapsedTime)

      // If less than 5 seconds have passed, wait for the remaining time
      if (remainingTime > 0) {
        // Update progress to 85% while waiting
        setEmailSendProgress(85)
        setLoadingMessage("Finalizing your receipt...")
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      if (data.success) {
        localStorage.setItem(`receipt_sent_${orderId}`, "true")
        setReceiptSent(true)
        setIsSendingEmail(false)
        setEmailSendProgress(100) // Complete progress
        setLoadingMessage("Receipt sent successfully!")

        // We'll show the toast notification in the calling function
        // to ensure we only show it once after the email is sent
      } else {
        console.error("[v0] Failed to send receipt email:", data.message)
        setIsSendingEmail(false)
        setEmailSendProgress(0) // Reset progress

        // Show error toast
        setShowToast(false)
        setTimeout(() => {
          setToastMessage("Failed to send receipt email. Please try again.")
          setToastType("error")
          setShowToast(true)
        }, 300)
      }

      return data
    } catch (error) {
      console.error("[v0] Error sending receipt email:", error)
      setIsSendingEmail(false)
      setEmailSendProgress(0) // Reset progress

      // Show error toast
      setShowToast(false)
      setTimeout(() => {
        setToastMessage(error.message || "Error sending receipt email. Please try again.")
        setToastType("error")
        setShowToast(true)
      }, 300)

      throw error
    }
  }



  // Function to toggle receipt view
  const toggleReceiptView = () => {
    setShowReceipt(!showReceipt)
  }

  // Function to handle retry navigation to PaymentPage
  const handleRetry = () => {
    const packageId = packageDetails?.id || packageDetails?._id || sessionStorage.getItem("currentPackageId")
    if (packageId) {
      navigate(`/payment/${packageId}`, {
        state: {
          bookingDetails,
          packageDetails,
          totalPrice: sessionStorage.getItem(`totalPrice_${packageId}`) ? JSON.parse(sessionStorage.getItem(`totalPrice_${packageId}`)) : (packageDetails?.price * (bookingDetails?.travelers || 1))
        }
      })
    } else {
      navigate("/")
    }
  }

  if (paymentStatus.loading) {
    return (
      <div className="ps-payment-status-container">
        <SEOHead
          title="Verifying Payment | Pratham Tours"
          description="Verifying your payment status for the tour package booking."
          keywords="payment verification, verification, status, Pratham Tours"
          canonical="https://prathamtours.com/payment-status"
        />
        <div className="ps-loading-container">
          <div className="ps-loading-spinner"></div>
          <p>Verifying payment status...</p>
        </div>
      </div>
    )
  }

  // Show email sending loader if payment is successful and email is being sent
  if (paymentStatus.success && isSendingEmail && !isEmailSendingComplete) {
    return (
      <div className="ps-payment-status-container" style={{ backgroundColor: "white" }}>
        <SEOHead
          title="Sending Receipt | Pratham Tours"
          description="Generating your booking receipt and sending it to your email."
          keywords="email receipt, receipt processing, Pratham Tours"
          canonical="https://prathamtours.com/payment-status"
        />
        <div className="ps-email-sending-fullscreen">
          <div className="ps-email-animation-container">
            <div className="ps-email-icon">
              <div className="ps-envelope">
                <div className="ps-envelope-top"></div>
                <div className="ps-envelope-body"></div>
                <div className="ps-envelope-paper"></div>
              </div>
              <div className="ps-email-waves">
                <div className="ps-wave ps-wave1"></div>
                <div className="ps-wave ps-wave2"></div>
                <div className="ps-wave ps-wave3"></div>
              </div>
            </div>
          </div>

          <div className="ps-email-progress-container">
            <div className="ps-email-progress-bar" style={{ width: `${emailSendProgress}%` }}></div>
            <div className="ps-email-progress-percentage">{emailSendProgress}%</div>
          </div>

          <div className="ps-email-message">
            <p>{loadingMessage}</p>
          </div>
        </div>

        {/* Hidden receipt element for client-side PDF generation */}
        {paymentStatus.orderDetails && bookingDetails && packageDetails && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "800px", opacity: 0, pointerEvents: "none", zIndex: -9999 }}>
            <div id="hidden-receipt-pdf">
              <ReceiptTemplate
                orderData={paymentStatus.orderDetails}
                bookingDetails={bookingDetails}
                packageDetails={packageDetails}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="ps-payment-status-container">
      <style dangerouslySetInnerHTML={{ __html: statusStyles }} />
      <SEOHead
        title={paymentStatus.success ? "Booking Confirmed | Pratham Tours" : "Booking Failed | Pratham Tours"}
        description="Verify the transaction status of your holiday package booking with Pratham Tours."
        keywords="booking status, payment verification, trip packages, Pratham Tours"
        canonical="https://prathamtours.com/payment-status"
      />
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className={`ps-status-card ${paymentStatus.success ? "ps-success" : "ps-error"}`}>
            <div className="ps-status-icon">
              {paymentStatus.success ? (
                <i className="fas fa-check-circle ps-animated-success"></i>
              ) : (
                <i className="fas fa-times-circle"></i>
              )}
            </div>

            <h2 className="ps-status-title">{paymentStatus.success ? "Payment Successful!" : "Payment Failed"}</h2>

            <p className="ps-status-message">{paymentStatus.message}</p>

            {!serverStatus && (
              <div className="ps-server-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Server connection error. Please make sure the server is running.</p>
              </div>
            )}

            {paymentStatus.success && (
              <div className="ps-ticket-info">
                <i className="fas fa-ticket-alt"></i>
                <p>Your original booking package tickets will be provided within a few hours.</p>
              </div>
            )}

            {paymentStatus.orderDetails && (
              <div className="ps-order-details">
                <h3>
                  <i className="fas fa-receipt ps-details-icon"></i> Order Details
                </h3>
                <div className="ps-details-grid">
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-hashtag"></i> Order ID:
                    </span>
                    <span className="ps-detail-value">{paymentStatus.orderDetails.order_id}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-rupee-sign"></i> Amount:
                    </span>
                    <span className="ps-detail-value">
                      ₹{paymentStatus.orderDetails.order_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-info-circle"></i> Status:
                    </span>
                    <span className="ps-detail-value ps-status-badge">{paymentStatus.orderDetails.order_status}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-calendar-check"></i> Booking Date:
                    </span>
                    <span className="ps-detail-value">{formatDateOnly(paymentStatus.orderDetails.booking_date)}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-clock"></i> Payment Time:
                    </span>
                    <span className="ps-detail-value">{formatTimeOnly(paymentStatus.orderDetails.payment_time)}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus.success && receiptSent && (
              <div className="ps-receipt-info">
                <p>
                  <i className="fas fa-envelope-open-text"></i> A receipt has been sent to your email address.
                </p>
              </div>
            )}

            <div className="ps-action-buttons">
              <Link to="/" className="ps-home-button">
                <i className="fas fa-home"></i> Return to Home
              </Link>
              {paymentStatus.success && (
                <button
                  className="ps-view-button"
                  onClick={toggleReceiptView}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "50px",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    backgroundColor: "rgb(108,117,125)",
                    color: "white",
                    border: "none",
                  }}
                >
                  <i className="fas fa-eye" style={{ marginRight: "8px" }}></i> View Receipt
                </button>
              )}
              {!paymentStatus.success && (
                <button className="ps-retry-button" onClick={handleRetry}>
                  <i className="fas fa-redo"></i> Try Again
                </button>
              )}
            </div>
          </div>
        </AnimatedElement>

        {/* Receipt Modal */}
        {showReceipt && paymentStatus.orderDetails && bookingDetails && packageDetails && (
          <div className="ps-receipt-modal">
            <div className="ps-receipt-modal-content">
              <div className="ps-receipt-modal-header">
                <h3>Booking Receipt</h3>
                <button className="ps-modal-close" onClick={toggleReceiptView}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="ps-receipt-modal-body">
                <ReceiptTemplate
                  orderData={paymentStatus.orderDetails}
                  bookingDetails={bookingDetails}
                  packageDetails={packageDetails}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden receipt element for client-side PDF generation */}
      {paymentStatus.orderDetails && bookingDetails && packageDetails && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "800px", opacity: 0, pointerEvents: "none", zIndex: -9999 }}>
          <div id="hidden-receipt-pdf">
            <ReceiptTemplate
              orderData={paymentStatus.orderDetails}
              bookingDetails={bookingDetails}
              packageDetails={packageDetails}
            />
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default PaymentStatus