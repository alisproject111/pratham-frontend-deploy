import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import AnimatedElement from "../components/AnimatedElement"
import { apiEndpoints } from "../config/api"
import { getCachedPackageByIdOrSlug, setCachedPackage } from "../utils/dataCache"
import SEOHead from "../components/SEOHead"

const bookingStyles = `
  .bp-booking-page { min-height: 100vh; }
  .bp-booking-container { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin: 40px 0; }
  .bp-booking-summary { background-color: white; border-radius: 8px; padding: 25px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); height: fit-content; position: sticky; top: 100px; transition: all 0.3s ease; }
  .bp-booking-summary:hover { box-shadow: 0 8px 25px rgba(14, 165, 233, 0.15); transform: translateY(-5px); }
  .bp-summary-title { margin-bottom: 20px; position: relative; padding-bottom: 10px; color: #333; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
  .bp-summary-icon { color: #f37121; }
  .bp-summary-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background-color: #f37121; }
  .bp-summary-details { margin-top: 20px; }
  .bp-summary-item { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; transition: all 0.3s ease; }
  .bp-summary-item:hover { transform: translateX(5px); }
  .bp-summary-item:last-child { border-bottom: none; }
  .bp-summary-item-icon-wrapper { display: flex; align-items: center; gap: 10px; }
  .bp-summary-item-icon { color: #f37121; width: 20px; text-align: center; }
  .bp-summary-label { color: #666; font-weight: 500; }
  .bp-summary-value { color: #333; font-weight: 600; }
  .bp-summary-item.bp-total { margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; border-bottom: none; }
  .bp-summary-item.bp-total .bp-summary-label, .bp-summary-item.bp-total .bp-summary-value { font-size: 1.2rem; color: #f37121; font-weight: 700; }
  .bp-summary-features { margin-top: 25px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; display: grid; grid-template-columns: 1fr; gap: 12px; }
  .bp-summary-feature { display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; }
  .bp-summary-feature:hover { transform: translateX(5px); }
  .bp-summary-feature i { color: #28a745; font-size: 1rem; }
  .bp-booking-form-container { background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; }
  .bp-booking-form-container:hover { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
  .bp-form-title { margin-bottom: 25px; position: relative; padding-bottom: 10px; color: #333; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
  .bp-form-icon { color: #f37121; }
  .bp-form-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background-color: #f37121; }
  .bp-booking-form { display: flex; flex-direction: column; gap: 20px; }
  .bp-travelers-selector { margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s ease; }
  .bp-travelers-selector:hover { background-color: #f0f0f0; }
  .bp-travelers-label { font-weight: 500; color: #333; display: flex; align-items: center; gap: 5px; }
  .bp-travelers-input-group { width: 100px; }
  .bp-travelers-input-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; text-align: center; transition: all 0.3s ease; }
  .bp-travelers-input-group input:focus { border-color: #f37121; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
  .bp-traveler-card { border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); transition: all 0.3s ease; position: relative; z-index: 1; }
  .bp-traveler-card:hover { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .bp-traveler-header { background-color: #f8f9fa; padding: 15px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; position: sticky; top: 0; z-index: 2; }
  .bp-traveler-header:hover { background-color: #f0f0f0; }
  .bp-traveler-header.bp-active { background-color: #f37121; color: white; }
  .bp-traveler-header h3 { margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; }
  .bp-traveler-subtitle { font-weight: normal; font-size: 0.9rem; opacity: 0.8; }
  .bp-toggle-icon { transition: transform 0.3s ease; }
  .bp-traveler-header.bp-active .bp-toggle-icon { transform: rotate(180deg); }
  .bp-traveler-content { padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease; }
  .bp-traveler-content-active { padding: 20px; max-height: 1000px; overflow-y: auto; }
  .bp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .bp-form-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .bp-form-group label { font-weight: 500; color: #333; display: flex; align-items: center; gap: 5px; }
  .bp-required { color: #f37121; }
  .bp-form-group input, .bp-form-group textarea, .bp-form-group select { padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background-color: #f8f9fa; }
  .bp-form-group input:focus, .bp-form-group textarea:focus, .bp-form-group select:focus { outline: none; border-color: #f37121; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); background-color: #fff; }
  .bp-form-group input.bp-error, .bp-form-group textarea.bp-error, .bp-form-group select.bp-error { border-color: #f37121; background-color: rgba(14, 165, 233, 0.05); }
  .bp-error-message { color: #f37121; font-size: 0.85rem; margin-top: 5px; }
  .bp-special-requests-section { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; transition: all 0.3s ease; }
  .bp-special-requests-section:hover { background-color: #f0f0f0; }
  .bp-special-requests-title { font-size: 1.1rem; margin-bottom: 15px; color: #333; display: flex; align-items: center; gap: 10px; }
  .bp-special-requests-title i { color: #f37121; }
  .bp-special-requests-textarea { font-size: 0.9rem !important; min-height: 80px; }
  .bp-terms-group { margin-top: 10px; }
  .bp-terms-container { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
  .bp-checkbox-container { display: flex; align-items: center; gap: 10px; }
  .bp-checkbox-container input[type="checkbox"] { margin-top: 0; width: 16px; height: 16px; cursor: pointer; appearance: none; -webkit-appearance: none; border: 1px solid #ddd; border-radius: 4px; position: relative; background-color: #f8f9fa; flex-shrink: 0; transition: all 0.3s ease; }
  .bp-checkbox-container input[type="checkbox"]:checked { background-color: #f37121; border-color: #f37121; }
  .bp-checkbox-container input[type="checkbox"]:checked::after { content: "✓"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 10px; }
  .bp-checkbox-container input[type="checkbox"].bp-error { border-color: #f37121; }
  .bp-checkbox-container label { font-weight: normal; font-size: 0.9rem; margin: 0; display: flex; align-items: center; }
  .bp-checkbox-container a { color: #f37121; text-decoration: underline; transition: all 0.3s ease; }
  .bp-checkbox-container a:hover { color: #2563eb; }
  .bp-terms-error { text-align: left; }
  .bp-form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; gap: 15px; }
  .bp-back-link { background-color: #f8f9fa; color: #333; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease; flex: 1; text-align: center; position: relative; overflow: hidden; height: 48px; }
  .bp-back-link:hover { background-color: #e9ecef; border-color: #ced4da; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .bp-back-link i { transition: transform 0.3s ease; }
  .bp-back-link:hover i { transform: translateX(-5px); }
  .bp-continue-button { background-color: #f37121; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.3s ease; flex: 1; position: relative; overflow: hidden; height: 48px; }
  .bp-continue-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .bp-continue-button i { transition: transform 0.3s ease; }
  .bp-continue-button:hover i { transform: translateX(5px); }
  .bp-send-request-button { background-color: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.3s ease; flex: 1; position: relative; overflow: hidden; height: 48px; }
  .bp-send-request-button:hover { background-color: #218838; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3); }
  .bp-send-request-button i { transition: transform 0.3s ease; }
  .bp-send-request-button:hover i { transform: translateX(5px); }
  .bp-confirmation-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(5px); }
  .bp-confirmation-content { background-color: white; border-radius: 12px; padding: 0; max-width: 550px; width: 100%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: bp-modalFadeIn 0.3s ease; overflow: hidden; }
  .bp-confirmation-header { background-color: #f37121; color: white; padding: 20px; text-align: center; }
  .bp-confirmation-icon { font-size: 3rem; margin-bottom: 10px; display: block; animation: bp-pulse 2s infinite; }
  @keyframes bp-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .bp-confirmation-header h2 { margin: 0 0 10px 0; font-size: 1.8rem; }
  .bp-confirmation-header p { margin: 0; opacity: 0.9; font-size: 1rem; }
  @keyframes bp-modalFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .bp-confirmation-details { padding: 20px; }
  .bp-confirmation-package-info { display: flex; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
  .bp-confirmation-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
  .bp-confirmation-package-details h3 { margin: 0 0 5px 0; font-size: 1.2rem; color: #333; }
  .bp-confirmation-package-details p { margin: 0; color: #666; display: flex; align-items: center; gap: 5px; }
  .bp-confirmation-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  .bp-confirmation-item { display: flex; align-items: center; gap: 10px; background-color: #f8f9fa; padding: 12px; border-radius: 8px; transition: all 0.3s ease; }
  .bp-confirmation-item:hover { background-color: #f0f0f0; transform: translateY(-3px); }
  .bp-confirmation-item-icon { color: #f37121; font-size: 1.2rem; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
  .bp-confirmation-label { display: block; font-size: 0.8rem; color: #666; }
  .bp-confirmation-value { display: block; font-weight: 600; color: #333; }
  .bp-confirmation-actions { display: flex; padding: 20px; background-color: #f8f9fa; gap: 15px; }
  .bp-cancel-button, .bp-confirm-button { flex: 1; padding: 12px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }
  .bp-cancel-button { background-color: #f8f9fa; color: #666; border: 1px solid #ddd; }
  .bp-cancel-button:hover { background-color: #eee; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  .bp-confirm-button { background-color: #f37121; color: white; border: none; }
  .bp-confirm-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .bp-loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; }
  .bp-loading-spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #f37121; border-radius: 50%; animation: bp-spin 1s linear infinite; }
  @keyframes bp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .bp-error-container { text-align: center; padding: 80px 20px; max-width: 600px; margin: 0 auto; }
  .bp-error-container i { color: #f37121; margin-bottom: 20px; }
  .bp-error-container h2 { font-size: 2rem; margin-bottom: 15px; color: #333; }
  .bp-error-container p { color: #666; margin-bottom: 30px; }
  .bp-back-button { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background-color: #f37121; color: white; border-radius: 4px; transition: all 0.3s ease; font-weight: 500; }
  .bp-back-button:hover { background-color: #2563eb; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3); }
  .bp-field-icon { color: #f37121; margin-right: 5px; width: 16px; text-align: center; }
  .bp-traveler-card, .bp-highlight-item, .bp-detail-item, .bp-back-link, .bp-continue-button, .bp-send-request-button, .bp-cancel-button, .bp-confirm-button, .bp-summary-feature, .bp-form-group input, .bp-form-group textarea, .bp-form-group select { transition: all 0.3s ease; }
  .bp-sending-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: bp-fadeIn 0.3s ease; }
  .bp-sending-content { background: white; padding: 40px; border-radius: 15px; text-align: center; max-width: 400px; width: 90%; animation: bp-slideUp 0.5s ease; }
  .bp-sending-spinner { width: 60px; height: 60px; border: 6px solid #f3f3f3; border-top: 6px solid #28a745; border-radius: 50%; animation: bp-spin 1s linear infinite; margin: 0 auto 20px; }
  .bp-sending-content h3 { color: #333; margin: 0 0 10px 0; font-size: 1.5rem; }
  .bp-sending-content p { color: #666; margin: 0; font-size: 1rem; }
  .bp-success-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: bp-fadeIn 0.3s ease; }
  .bp-success-content { background: white; padding: 40px; border-radius: 15px; text-align: center; max-width: 400px; width: 90%; animation: bp-slideUp 0.5s ease; position: relative; }
  .bp-success-icon { font-size: 4rem; color: #28a745; margin-bottom: 20px; animation: bp-bounceIn 0.8s ease; }
  .bp-success-content h3 { color: #333; margin: 0 0 15px 0; font-size: 1.5rem; }
  .bp-success-content p { color: #666; margin: 0; font-size: 1rem; line-height: 1.5; }
  .bp-success-checkmark { position: absolute; top: -10px; right: -10px; background: #28a745; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; animation: bp-checkmarkPop 0.6s ease 0.5s both; }
  @media (max-width: 992px) { .bp-booking-container { grid-template-columns: 1fr; } .bp-booking-summary { position: static; margin-bottom: 30px; } }
  @media (max-width: 768px) { .bp-booking-header { padding: 40px 0; } .bp-booking-container { margin: 30px 0; } .bp-booking-summary, .bp-booking-form-container { padding: 20px; } .bp-summary-title, .bp-form-title { font-size: 1.3rem; margin-bottom: 15px; } .bp-form-row { grid-template-columns: 1fr; gap: 15px; } .bp-form-group input, .bp-form-group textarea, .bp-form-group select { padding: 10px 12px; font-size: 0.9rem; } .bp-form-actions { flex-direction: column; gap: 15px; } .bp-back-link, .bp-continue-button, .bp-send-request-button { width: 100%; justify-content: center; height: 44px; font-size: 0.9rem; } .bp-confirmation-content { padding: 0; } .bp-confirmation-info-grid { grid-template-columns: 1fr; } .bp-confirmation-actions { flex-direction: column; } .bp-cancel-button, .bp-confirm-button { width: 100%; padding: 10px; font-size: 0.9rem; } .bp-booking-summary { position: static; width: 100%; padding: 15px; } .bp-summary-details { margin-top: 15px; } .bp-summary-item { margin-bottom: 10px; padding-bottom: 10px; } .bp-summary-item-icon, .bp-summary-icon, .bp-field-icon, .bp-confirmation-item-icon { font-size: 0.9rem; } .bp-confirmation-content { max-width: 100%; margin: 0 10px; } .bp-confirmation-info-grid { grid-template-columns: 1fr; gap: 10px; } .bp-confirmation-item { padding: 10px; } .bp-summary-label, .bp-summary-value { font-size: 0.9rem; } .bp-summary-item.bp-total .bp-summary-label, .bp-summary-item.bp-total .bp-summary-value { font-size: 1.1rem; } }
  @media (max-width: 576px) { .bp-booking-header { padding: 30px 0; } .bp-page-title { font-size: 1.6rem; } .bp-page-subtitle { font-size: 0.85rem; } .bp-booking-summary, .bp-booking-form-container { padding: 15px; } .bp-summary-item { font-size: 0.85rem; } .bp-traveler-header h3 { font-size: 1rem; } .bp-traveler-subtitle { font-size: 0.8rem; } .bp-traveler-content-active { padding: 15px; } .bp-checkbox-container label { font-size: 0.8rem; } }
  @media (max-width: 480px) { .bp-booking-container { margin: 20px 0; } .bp-summary-item { flex-direction: column; align-items: flex-start; gap: 5px; } .bp-summary-value { margin-left: 25px; } .bp-summary-item-icon, .bp-summary-icon, .bp-field-icon { font-size: 0.8rem; } .bp-summary-label, .bp-summary-value { font-size: 0.85rem; } .bp-confirmation-header h2 { font-size: 1.5rem; margin-bottom: 5px; } .bp-confirmation-header p { font-size: 0.85rem; } .bp-confirmation-icon { font-size: 1.8rem; margin-bottom: 5px; } .bp-confirmation-details { padding: 15px; overflow-y: auto; flex: 1; } .bp-confirmation-info-grid { grid-template-columns: 1fr; gap: 10px; } .bp-confirmation-item { padding: 8px; } .bp-confirmation-label { font-size: 0.7rem; } .bp-confirmation-value { font-size: 0.8rem; } .bp-confirmation-actions { padding: 15px; position: sticky; bottom: 0; background-color: #f8f9fa; z-index: 10; box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); } .bp-cancel-button, .bp-confirm-button { padding: 10px; font-size: 0.9rem; } }
  @keyframes bp-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes bp-slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bp-bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes bp-checkmarkPop { 0% { opacity: 0; transform: scale(0); } 80% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
`

function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cachedPackage = getCachedPackageByIdOrSlug(id)
  const [packageData, setPackageData] = useState(cachedPackage)
  const [loading, setLoading] = useState(!cachedPackage)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeCustomer, setActiveCustomer] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    travelDate: "",
    travelers: 1,
    specialRequests: "",
    termsAccepted: false,
    additionalTravelers: [],
  })

  // Form errors
  const [formErrors, setFormErrors] = useState({})

  // Calculate total price
  const totalPrice = packageData ? packageData.price * formData.travelers : 0

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    if (cachedPackage) return

    let active = true
    const fetchPackageData = async () => {
      try {
        const fetchUrl = apiEndpoints.getPackageById(id)
        console.log("[v0] Booking: Fetching package from:", fetchUrl)

        const response = await fetch(fetchUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.package) {
          if (active) {
            setCachedPackage(id, data.package)
            setPackageData(data.package)
            setError(null)
            setLoading(false)
            console.log("[v0] Booking: Package loaded successfully")
          }
        } else {
          throw new Error("Package not found")
        }
      } catch (err) {
        console.error("[v0] Error fetching package for booking, retrying in 3s:", err)
        if (active) {
          setTimeout(fetchPackageData, 3000)
        }
      }
    }

    fetchPackageData()
    return () => {
      active = false
    }
  }, [id, cachedPackage])

  // Update additional travelers when traveler count changes
  useEffect(() => {
    setFormData((prev) => {
      const currentTravelers = prev.additionalTravelers || []
      const newTravelerCount = Math.max(0, prev.travelers - 1)

      if (currentTravelers.length < newTravelerCount) {
        // Add more traveler slots
        const newTravelers = [...currentTravelers]
        for (let i = currentTravelers.length; i < newTravelerCount; i++) {
          newTravelers.push({ fullName: "", gender: "", age: "" })
        }
        return {
          ...prev,
          additionalTravelers: newTravelers,
        }
      } else if (currentTravelers.length > newTravelerCount) {
        // Remove excess traveler slots
        return {
          ...prev,
          additionalTravelers: currentTravelers.slice(0, newTravelerCount),
        }
      }
      return prev
    })
  }, [formData.travelers])

  // Set minimum date for travel date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 3)
  const minDate = tomorrow.toISOString().split("T")[0]

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Use the checked value for checkboxes, otherwise use the value
    const newValue = type === "checkbox" ? checked : value

    // Validation for phone number (numbers only, not starting with 0, and max 10 digits)
    if (name === "phone") {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        return // Don't update if non-digit characters
      }
      // Don't allow starting with 0
      if (value.length > 0 && value[0] === "0") {
        return // Don't update if starts with 0
      }
      // Limit to 10 digits
      if (value.length > 10) {
        return // Don't update if more than 10 digits
      }
    }

    // Validation for age (numbers only)
    if (name === "age") {
      if (!/^\d*$/.test(value)) {
        return // Don't update if non-digit characters
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Handle additional traveler form changes
  const handleTravelerChange = (index, field, value) => {
    // Validation for age (numbers only)
    if (field === "age" && !/^\d*$/.test(value)) {
      return // Don't update if non-digit characters
    }

    const updatedTravelers = [...formData.additionalTravelers]
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    }

    setFormData((prev) => ({
      ...prev,
      additionalTravelers: updatedTravelers,
    }))

    // Clear error if exists
    if (formErrors[`traveler_${index}_${field}`]) {
      setFormErrors((prev) => ({
        ...prev,
        [`traveler_${index}_${field}`]: undefined,
      }))
    }
  }

  // Toggle active customer details section
  const toggleCustomerDetails = (index) => {
    if (activeCustomer === index) {
      setActiveCustomer(null)
    } else {
      setActiveCustomer(index)
      // Remove scrolling behavior when opening traveler details
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    // Validate primary traveler
    if (!formData.fullName.trim()) errors.fullName = "Full name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Email is invalid"

    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Phone must be 10 digits"

    if (!formData.gender) errors.gender = "Gender is required"
    if (!formData.age) errors.age = "Age is required"
    else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 120) errors.age = "Please enter a valid age"

    if (formData.travelers < 1) errors.travelers = "At least 1 traveler is required"
    if (formData.travelers > 20) errors.travelers = "Maximum 20 travelers allowed"

    if (!formData.travelDate) errors.travelDate = "Travel date is required"

    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions"

    // Validate additional travelers
    formData.additionalTravelers.forEach((traveler, index) => {
      if (!traveler.fullName.trim()) errors[`traveler_${index}_fullName`] = "Full name is required"

      if (!traveler.gender) errors[`traveler_${index}_gender`] = "Gender is required"

      if (!traveler.age) errors[`traveler_${index}_age`] = "Age is required"
      else if (isNaN(traveler.age) || traveler.age <= 0 || traveler.age > 120)
        errors[`traveler_${index}_age`] = "Please enter a valid age"
    })

    return errors
  }

  // Add a function to handle traveler count changes with validation
  const handleTravelerCountChange = (e) => {
    const value = Number.parseInt(e.target.value)

    // Enforce the 20 traveler limit and minimum of 1
    if (value > 20) {
      setFormData((prev) => ({
        ...prev,
        travelers: 20,
      }))

      setFormErrors((prev) => ({
        ...prev,
        travelers: "Maximum 20 travelers allowed",
      }))
    } else if (value < 1) {
      setFormData((prev) => ({
        ...prev,
        travelers: 1,
      }))

      // Clear error message when value is valid
      setFormErrors((prev) => ({
        ...prev,
        travelers: undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        travelers: value,
      }))

      // Clear error message when value is valid
      setFormErrors((prev) => ({
        ...prev,
        travelers: undefined,
      }))
    }
  }

  // Prevent scroll from changing number input value
  const preventScrollChange = (e) => {
    e.target.blur()
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Find the first error and scroll to it
      const firstErrorKey = Object.keys(errors)[0]

      // Handle different types of errors
      if (firstErrorKey.includes("traveler_")) {
        // Extract the traveler index from the error key
        const travelerIndex = Number.parseInt(firstErrorKey.split("_")[1]) + 1
        setActiveCustomer(travelerIndex)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.querySelector(`.bp-traveler-card:nth-child(${travelerIndex + 2})`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else if (firstErrorKey === "termsAccepted") {
        const element = document.querySelector(".bp-terms-group")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else if (
        firstErrorKey === "fullName" ||
        firstErrorKey === "email" ||
        firstErrorKey === "phone" ||
        firstErrorKey === "gender" ||
        firstErrorKey === "age" ||
        firstErrorKey === "travelDate"
      ) {
        setActiveCustomer(0)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.getElementById(firstErrorKey)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else {
        // For other errors like travelers count
        const element = document.getElementById(firstErrorKey)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }

      return
    }

    // Show confirmation modal
    setShowConfirmation(true)
  }

  const handleContinueToPayment = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Find the first error and scroll to it
      const firstErrorKey = Object.keys(errors)[0]

      // Handle different types of errors
      if (firstErrorKey.includes("traveler_")) {
        // Extract the traveler index from the error key
        const travelerIndex = Number.parseInt(firstErrorKey.split("_")[1]) + 1
        setActiveCustomer(travelerIndex)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.querySelector(`.bp-traveler-card:nth-child(${travelerIndex + 2})`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else if (firstErrorKey === "termsAccepted") {
        const element = document.querySelector(".bp-terms-group")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else if (
        firstErrorKey === "fullName" ||
        firstErrorKey === "email" ||
        firstErrorKey === "phone" ||
        firstErrorKey === "gender" ||
        firstErrorKey === "age" ||
        firstErrorKey === "travelDate"
      ) {
        setActiveCustomer(0)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.getElementById(firstErrorKey)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else {
        // For other errors like travelers count
        const element = document.getElementById(firstErrorKey)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }

      return
    }

    // Navigate to payment page with booking data
    navigate(`/payment/${id}`, {
      state: {
        bookingDetails: formData,
        packageDetails: packageData,
        totalPrice: totalPrice,
        packageId: id,
      },
    })
  }

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      setShowConfirmation(false)
      setIsSending(true)

      // Submit booking request to backend using apiEndpoints
      const response = await fetch(apiEndpoints.createBookingRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDetails: formData,
          packageDetails: packageData,
          totalPrice: totalPrice,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Clear form data from localStorage
        localStorage.removeItem(`bookingFormData_${id}`)

        setIsSending(false)
        setShowSuccess(true)

        // Navigate back after showing success message
        setTimeout(() => {
          navigate(`/package/${id}`)
        }, 3000)
      } else {
        throw new Error(result.message || "Failed to submit booking request")
      }
    } catch (error) {
      console.error("[v0] Error submitting booking request:", error)
      setIsSending(false)
      alert("Failed to submit booking request. Please try again.")
    }
  }

  useEffect(() => {
    // Restore form data from localStorage if available
    const savedFormData = localStorage.getItem(`bookingFormData_${id}`)
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData)
        setFormData(parsedData)
      } catch (err) {
        console.error("Error parsing saved form data", err)
      }
    }
  }, [id])

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (formData.fullName || formData.email || formData.phone) {
      localStorage.setItem(`bookingFormData_${id}`, JSON.stringify(formData))
    }
  }, [formData, id])

  if (loading) {
    return (
      <div className="bp-loading-container">
        <div className="bp-loading-spinner"></div>
        <p>Loading booking form...</p>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="bp-error-container">
        <i className="fas fa-exclamation-circle fa-3x"></i>
        <h2>Error</h2>
        <p>{error || "Package not found"}</p>
        <Link to="/packages" className="bp-back-button">
          <i className="fas fa-arrow-left"></i> Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="bp-booking-page">
      <style dangerouslySetInnerHTML={{ __html: bookingStyles }} />
      <SEOHead
        title={`Book ${packageData ? packageData.name : "Package"} | Pratham Tours`}
        description={`Securely book the ${packageData ? packageData.name : "travel"} package at Pratham Tours. Fill out the traveler form to initiate your booking request.`}
        keywords="booking, travel booking, book tour, holiday packages, tourist trip booking, Pratham Tours"
        canonical={`https://prathamtours.com/booking/${id}`}
      />
      {isSending && (
        <div className="bp-sending-overlay">
          <div className="bp-sending-content">
            <div className="bp-sending-spinner"></div>
            <h3>Sending Your Request...</h3>
            <p>Please wait while we process your booking request</p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="bp-success-overlay">
          <div className="bp-success-content">
            <div className="bp-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Booking Request Sent Successfully!</h3>
            <p>We will contact you soon to confirm your booking details.</p>
            <div className="bp-success-checkmark">✓</div>
          </div>
        </div>
      )}

      {/* Updated header with inline background image */}
      <div 
        className="bp-booking-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/hero/booking-header.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="bp-page-title">Book Your Trip</h1>
            <p className="bp-page-subtitle">
              {packageData.name} - {packageData.location}
            </p>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        <div className="bp-booking-container">
          <AnimatedElement animation="fade-up" delay={100}>
            <div className="bp-booking-summary">
              <h2 className="bp-summary-title">
                <i className="fas fa-suitcase bp-summary-icon"></i> Trip Summary
              </h2>
              <div className="bp-summary-details">
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-map-marked-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Package:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.name}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-map-marker-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Destination:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.location}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-calendar-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Duration:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.duration} Days</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-tag bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Price per person:</span>
                  </div>
                  <span className="bp-summary-value">₹{packageData.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-users bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Number of travelers:</span>
                  </div>
                  <span className="bp-summary-value">{formData.travelers}</span>
                </div>
                <div className="bp-summary-item bp-total">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-money-bill-wave bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Total Price:</span>
                  </div>
                  <span className="bp-summary-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="bp-summary-features">
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Instant Confirmation</span>
                </div>
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Free Cancellation</span>
                </div>
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </AnimatedElement>

          <AnimatedElement animation="fade-up" delay={200}>
            <div className="bp-booking-form-container">
              <h2 className="bp-form-title">
                <i className="fas fa-user-circle bp-form-icon"></i> Traveler Information
              </h2>
              <form className="bp-booking-form" onSubmit={handleSubmit}>
                {/* Number of travelers selector */}
                <div className="bp-travelers-selector">
                  <label htmlFor="travelers" className="bp-travelers-label">
                    Number of Travelers <span className="bp-required">*</span>
                  </label>
                  <div className="bp-travelers-input-group">
                    <input
                      type="number"
                      id="travelers"
                      name="travelers"
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={handleTravelerCountChange}
                      onWheel={preventScrollChange}
                      className={formErrors.travelers ? "bp-error" : ""}
                    />
                    {formErrors.travelers && <div className="bp-error-message">{formErrors.travelers}</div>}
                  </div>
                </div>

                {/* Primary traveler details */}
                <div className="bp-traveler-card bp-primary-traveler">
                  <div
                    className={`bp-traveler-header ${activeCustomer === 0 ? "bp-active" : ""}`}
                    onClick={() => toggleCustomerDetails(0)}
                  >
                    <h3>
                      <i className="fas fa-user"></i> Lead Traveler
                      <span className="bp-traveler-subtitle">{formData.fullName ? ` - ${formData.fullName}` : ""}</span>
                    </h3>
                    <i
                      className={`fas ${activeCustomer === 0 ? "fa-chevron-up" : "fa-chevron-down"} bp-toggle-icon`}
                    ></i>
                  </div>

                  <div className={`bp-traveler-content ${activeCustomer === 0 ? "bp-traveler-content-active" : ""}`}>
                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="fullName">
                          <i className="fas fa-user bp-field-icon"></i> Full Name <span className="bp-required">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={formErrors.fullName ? "bp-error" : ""}
                        />
                        {formErrors.fullName && <div className="bp-error-message">{formErrors.fullName}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="email">
                          <i className="fas fa-envelope bp-field-icon"></i> Email <span className="bp-required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={formErrors.email ? "bp-error" : ""}
                        />
                        {formErrors.email && <div className="bp-error-message">{formErrors.email}</div>}
                      </div>
                    </div>

                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="phone">
                          <i className="fas fa-phone bp-field-icon"></i> Phone Number{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={formErrors.phone ? "bp-error" : ""}
                        />
                        {formErrors.phone && <div className="bp-error-message">{formErrors.phone}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="gender">
                          <i className="fas fa-venus-mars bp-field-icon"></i> Gender{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={formErrors.gender ? "bp-error" : ""}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.gender && <div className="bp-error-message">{formErrors.gender}</div>}
                      </div>
                    </div>

                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="age">
                          <i className="fas fa-birthday-cake bp-field-icon"></i> Age{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={handleChange}
                          onWheel={preventScrollChange}
                          className={formErrors.age ? "bp-error" : ""}
                        />
                        {formErrors.age && <div className="bp-error-message">{formErrors.age}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="travelDate">
                          <i className="fas fa-calendar-alt bp-field-icon"></i> Travel Date{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="date"
                          id="travelDate"
                          name="travelDate"
                          min={minDate}
                          value={formData.travelDate}
                          onChange={handleChange}
                          className={formErrors.travelDate ? "bp-error" : ""}
                        />
                        {formErrors.travelDate && <div className="bp-error-message">{formErrors.travelDate}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional travelers */}
                {formData.additionalTravelers.map((traveler, index) => (
                  <div key={index} className="bp-traveler-card bp-additional-traveler">
                    <div
                      className={`bp-traveler-header ${activeCustomer === index + 1 ? "bp-active" : ""}`}
                      onClick={() => toggleCustomerDetails(index + 1)}
                    >
                      <h3>
                        <i className="fas fa-user-friends"></i> Traveler {index + 2}
                        <span className="bp-traveler-subtitle">
                          {traveler.fullName ? ` - ${traveler.fullName}` : ""}
                        </span>
                      </h3>
                      <i
                        className={`fas ${
                          activeCustomer === index + 1 ? "fa-chevron-up" : "fa-chevron-down"
                        } bp-toggle-icon`}
                      ></i>
                    </div>

                    <div
                      className={`bp-traveler-content ${
                        activeCustomer === index + 1 ? "bp-traveler-content-active" : ""
                      }`}
                    >
                      <div className="bp-form-row">
                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-user bp-field-icon"></i> Full Name{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveler.fullName}
                            onChange={(e) => handleTravelerChange(index, "fullName", e.target.value)}
                            className={formErrors[`traveler_${index}_fullName`] ? "bp-error" : ""}
                          />
                          {formErrors[`traveler_${index}_fullName`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_fullName`]}</div>
                          )}
                        </div>

                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-venus-mars bp-field-icon"></i> Gender{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <select
                            value={traveler.gender}
                            onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                            className={formErrors[`traveler_${index}_gender`] ? "bp-error" : ""}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {formErrors[`traveler_${index}_gender`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_gender`]}</div>
                          )}
                        </div>
                      </div>

                      <div className="bp-form-row">
                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-birthday-cake bp-field-icon"></i> Age{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={traveler.age}
                            onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                            onWheel={preventScrollChange}
                            className={formErrors[`traveler_${index}_age`] ? "bp-error" : ""}
                          />
                          {formErrors[`traveler_${index}_age`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_age`]}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Special Requests - Moved outside traveler details */}
                <div className="bp-special-requests-section">
                  <h3 className="bp-special-requests-title">
                    <i className="fas fa-comment-alt"></i> Special Requests
                  </h3>
                  <div className="bp-form-group">
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      placeholder="Any special requirements or preferences? Let us know here."
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="bp-special-requests-textarea"
                    ></textarea>
                  </div>
                </div>

                <div className="bp-form-group bp-terms-group">
                  <div className="bp-terms-container">
                    <div className="bp-checkbox-container">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className={formErrors.termsAccepted ? "bp-error" : ""}
                      />
                      <label htmlFor="termsAccepted" className="bp-terms-label">
                        I accept the{" "}
                        <a href="https://prathamtours.com/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                          terms and conditions
                        </a>{" "}
                        <span className="bp-required">*</span>
                      </label>
                    </div>
                    {formErrors.termsAccepted && (
                      <div className="bp-error-message bp-terms-error">{formErrors.termsAccepted}</div>
                    )}
                  </div>
                </div>

                <div className="bp-form-actions">
                  <Link to={`/package/${id}`} className="bp-back-link">
                    <i className="fas fa-arrow-left"></i> Back to Package
                  </Link>
                  <button type="submit" className="bp-send-request-button">
                    Send Request <i className="fas fa-paper-plane"></i>
                  </button>
                  <button type="button" onClick={handleContinueToPayment} className="bp-continue-button">
                    Continue to Payment <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </AnimatedElement>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="bp-confirmation-modal">
          <div className="bp-confirmation-content">
            <div className="bp-confirmation-header">
              <i className="fas fa-check-circle bp-confirmation-icon"></i>
              <h2>Confirm Your Booking Request</h2>
              <p>Please review your booking details before sending the request</p>
            </div>

            <div className="bp-confirmation-details">
              <div className="bp-confirmation-info-grid">
                <div className="bp-confirmation-item">
                  <i className="fas fa-map-marked-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Package</span>
                    <span className="bp-confirmation-value">{packageData.name}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-map-marker-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Destination</span>
                    <span className="bp-confirmation-value">{packageData.location}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-users bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Travelers</span>
                    <span className="bp-confirmation-value">{formData.travelers}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-calendar-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Travel Date</span>
                    <span className="bp-confirmation-value">{formData.travelDate}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-money-bill-wave bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Total Amount</span>
                    <span className="bp-confirmation-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-user bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Lead Traveler</span>
                    <span className="bp-confirmation-value">{formData.fullName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bp-confirmation-actions">
              <button className="bp-cancel-button" onClick={() => setShowConfirmation(false)}>
                <i className="fas fa-times"></i> Edit Details
              </button>
              <button className="bp-confirm-button" onClick={handleConfirm}>
                <i className="fas fa-check"></i> Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage