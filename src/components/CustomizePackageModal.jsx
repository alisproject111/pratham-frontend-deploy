import { useState, useEffect, useRef } from "react"
import Toast from "./Toast"
import { apiEndpoints } from "../config/api"

const modalStyles = `
  .customize-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(8px); transition: all 0.3s ease; }
  .customize-modal-overlay.submitting { backdrop-filter: blur(12px); }
  .customize-modal { background-color: white; border-radius: 15px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); animation: modalFadeIn 0.4s ease-out; position: relative; transition: all 0.3s ease; border: 1px solid rgba(229, 57, 53, 0.1); }
  .customize-modal-overlay.submitting .customize-modal { filter: blur(4px); opacity: 0.7; pointer-events: none; }
  @keyframes modalFadeIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 25px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%); color: white; border-radius: 15px 15px 0 0; }
  .modal-header h2 { margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); }
  .close-btn { background: rgba(255, 255, 255, 0.1); border: none; color: white; font-size: 1.2rem; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease; }
  .close-btn:hover { background-color: rgba(255, 255, 255, 0.25); transform: rotate(90deg); }
  .progress-bar { padding: 25px 30px; background-color: #f9f9f9; border-bottom: 1px solid #eee; }
  .progress-steps { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .step { display: flex; flex-direction: column; align-items: center; width: 33.33%; position: relative; }
  .step-number { width: 35px; height: 35px; border-radius: 50%; background-color: #ddd; color: #666; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 8px; transition: all 0.4s ease; font-size: 0.95rem; }
  .step.active .step-number { background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%); color: white; box-shadow: 0 0 0 5px rgba(229, 57, 53, 0.2); transform: scale(1.1); }
  .step-label { font-size: 0.9rem; color: #666; transition: all 0.3s; font-weight: 500; }
  .step.active .step-label { color: #e53935; font-weight: 600; transform: scale(1.05); }
  .progress-line { height: 6px; background-color: #ddd; border-radius: 3px; position: relative; overflow: hidden; }
  .progress-line-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, #e53935, #ff9800); transition: width 0.4s ease; border-radius: 3px; }
  .modal-body { padding: 30px; }
  .tab-content { display: none; }
  .tab-content.active { display: block; animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .tab-title { font-size: 1.3rem; color: #333; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; position: relative; padding-bottom: 10px; }
  .tab-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 60px; height: 3px; background: linear-gradient(90deg, #e53935, #ff9800); border-radius: 2px; }
  .tab-title i { color: #e53935; font-size: 1.1rem; }
  .form-group { margin-bottom: 25px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 0.95rem; transition: all 0.3s ease; }
  .required { color: #e53935; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background-color: #f9f9f9; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #e53935; box-shadow: 0 0 0 4px rgba(229, 57, 53, 0.1); outline: none; background-color: #fff; }
  .error-message { color: #e53935; font-size: 0.85rem; margin-top: 5px; }
  input.error, select.error, textarea.error { border-color: #e53935 !important; background-color: rgba(229, 57, 53, 0.05) !important; }
  .activities-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
  .activity-checkbox { cursor: pointer; display: flex; align-items: center; padding: 10px 15px; background-color: #f9f9f9; border-radius: 8px; transition: all 0.3s ease; border: 1px solid #eee; }
  .activity-checkbox:hover { background-color: #f0f0f0; transform: translateY(-2px); }
  .activity-checkbox input[type="checkbox"] { cursor: pointer; width: auto; margin-right: 10px; accent-color: #e53935; transform: scale(1.2); }
  .activity-checkbox label { cursor: pointer; margin-bottom: 0; font-weight: normal; user-select: none; }
  .modal-footer { padding: 25px 30px; border-top: 1px solid #eee; display: flex; justify-content: space-between; background-color: #f9f9f9; border-radius: 0 0 15px 15px; }
  .prev-btn, .next-btn, .submit-btn { padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; font-size: 0.95rem; }
  .prev-btn { background-color: #f5f5f5; color: #666; border: 1px solid #ddd; }
  .prev-btn:hover { background-color: #eee; transform: translateX(-3px); }
  .next-btn, .submit-btn { background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%); color: white; border: none; box-shadow: 0 4px 15px rgba(229, 57, 53, 0.3); }
  .next-btn:hover, .submit-btn:hover { background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(229, 57, 53, 0.4); }
  .next-btn:hover { transform: translateX(3px); }
  .submit-btn:disabled { background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%); cursor: not-allowed; transform: none; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
  .spinner { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .destination-group { position: relative; }
  .destination-input-wrapper { position: relative; }
  .destination-suggestions { position: absolute; top: 100%; left: 0; right: 0; background-color: white; border: 2px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; max-height: 250px; overflow-y: auto; z-index: 10; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
  .destination-suggestions ul { list-style: none; padding: 0; margin: 0; }
  .destination-suggestions li { padding: 12px 15px; cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid #f0f0f0; }
  .destination-suggestions li:hover { background-color: #f5f5f5; }
  .destination-suggestions li i { color: #e53935; margin-right: 10px; }
  .success-message { text-align: center; padding: 50px 30px; animation: fadeIn 0.5s ease-out; position: relative; }
  .close-success-btn { position: absolute; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.05); border: none; color: #666; font-size: 1.2rem; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease; }
  .close-success-btn:hover { background-color: rgba(0, 0, 0, 0.1); color: #e53935; transform: rotate(90deg); }
  .success-icon { font-size: 5rem; color: #4caf50; margin-bottom: 25px; animation: scaleIn 0.5s ease-out; }
  @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  .success-message h3 { font-size: 2.2rem; color: #333; margin-bottom: 20px; }
  .success-message p { color: #666; margin-bottom: 12px; font-size: 1.2rem; line-height: 1.6; }
  .success-timer { margin-top: 30px; width: 100%; max-width: 300px; margin-left: auto; margin-right: auto; }
  .timer-bar { height: 6px; background-color: #e0e0e0; border-radius: 3px; position: relative; overflow: hidden; }
  .timer-bar::after { content: ""; position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); animation: timerCount 5s linear forwards; border-radius: 3px; }
  @keyframes timerCount { from { width: 100%; } to { width: 0%; } }
  .timer-text { font-size: 0.9rem; color: #777; margin-top: 10px; }
  .activity-checkbox.active { background-color: rgba(229, 57, 53, 0.05); border-color: #e53935; box-shadow: 0 4px 12px rgba(229, 57, 53, 0.1); transform: translateY(-1px); }
  @media (max-width: 768px) { .customize-modal { width: 92%; max-height: 88vh; } .modal-header { padding: 20px 25px; } .modal-header h2 { font-size: 1.3rem; } .progress-bar { padding: 15px 20px; } .modal-body { padding: 20px 25px; } .form-row { grid-template-columns: 1fr; gap: 15px; } .activities-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .step-label { font-size: 0.8rem; } .modal-footer { padding: 20px 25px; } }
  @media (max-width: 576px) { .customize-modal { width: 95%; max-height: 92vh; border-radius: 12px; } .modal-header { padding: 15px 20px; border-radius: 12px 12px 0 0; } .modal-header h2 { font-size: 1.15rem; } .close-btn { width: 32px; height: 32px; font-size: 1rem; } .progress-bar { padding: 12px 15px; } .step-number { width: 28px; height: 28px; font-size: 0.85rem; margin-bottom: 5px; } .step-label { font-size: 0.75rem; text-align: center; } .modal-body { padding: 15px; } .tab-title { font-size: 1.1rem; margin-bottom: 15px; } .form-group { margin-bottom: 15px; } .form-group label { font-size: 0.85rem; margin-bottom: 6px; } .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; font-size: 0.9rem; border-radius: 6px; } .activities-grid { grid-template-columns: 1fr; gap: 10px; } .activity-checkbox { padding: 8px 12px; } .activity-checkbox label { font-size: 0.85rem; } .modal-footer { padding: 15px; border-radius: 0 0 12px 12px; } .prev-btn, .next-btn, .submit-btn { padding: 10px 16px; font-size: 0.9rem; border-radius: 6px; } }
  @media (max-width: 375px) { .customize-modal { width: 98%; max-height: 96vh; border-radius: 10px; } .modal-header { padding: 12px 15px; border-radius: 10px 10px 0 0; } .modal-header h2 { font-size: 1.05rem; } .progress-bar { padding: 10px 8px; } .step-label { display: none; } .step-number { margin-bottom: 0; } .modal-body { padding: 12px; } .tab-title { font-size: 1rem; } .form-group input, .form-group select, .form-group textarea { padding: 8px 10px; font-size: 0.85rem; } .modal-footer { padding: 12px; border-radius: 0 0 10px 10px; } .prev-btn, .next-btn, .submit-btn { padding: 8px 12px; font-size: 0.8rem; } }
  .submission-animation { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1100; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .animation-content { background-color: rgba(255, 255, 255, 0.95); border-radius: 15px; padding: 40px 50px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); animation: fadeInScale 0.4s ease-out; border: 1px solid rgba(229, 57, 53, 0.1); }
  @keyframes fadeInScale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  .spinner-container { position: relative; width: 100px; height: 100px; margin-bottom: 25px; }
  .spinner-circle { position: absolute; width: 70px; height: 70px; border: 5px solid transparent; border-top-color: #e53935; border-radius: 50%; top: 15px; left: 15px; animation: spin 1s linear infinite; }
  .spinner-circle-outer { position: absolute; width: 100px; height: 100px; border: 5px solid transparent; border-right-color: #d32f2f; border-radius: 50%; animation: spin 1.5s linear infinite reverse; }
  .animation-content p { font-size: 20px; font-weight: 600; color: #333; margin: 0; }
  @media (max-width: 480px) { .animation-content { padding: 30px 40px; } .spinner-container { width: 80px; height: 80px; margin-bottom: 20px; } .spinner-circle { width: 55px; height: 55px; top: 12.5px; left: 12.5px; border-width: 4px; } .spinner-circle-outer { width: 80px; height: 80px; border-width: 4px; } .animation-content p { font-size: 18px; } }
`

function CustomizePackageModal({ onClose }) {
  const modalRef = useRef(null)
  const [activeTab, setActiveTab] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    startDate: "",
    duration: "",
    budget: "",
    travelers: "1",
    activities: [],
    accommodation: "standard",
    transportation: "public",
    specialRequests: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    let timer
    if (isSuccess) {
      setCountdown(5)
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isSuccess, onClose])

  // Activity options
  const activityOptions = [
    { id: "sightseeing", label: "Sightseeing & City Tours" },
    { id: "adventure", label: "Adventure Activities" },
    { id: "beach", label: "Beach & Water Sports" },
    { id: "cultural", label: "Cultural Experiences" },
    { id: "wildlife", label: "Wildlife & Safari" },
    { id: "food", label: "Food & Culinary Tours" },
    { id: "shopping", label: "Shopping" },
    { id: "relaxation", label: "Wellness & Spa" },
    { id: "photography", label: "Photography Tours" },
    { id: "nightlife", label: "Nightlife" },
  ]

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // For phone field, only allow digits
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "")
      setFormData({
        ...formData,
        [name]: onlyNums,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle checkbox change for activities
  const handleActivityChange = (e) => {
    const { value, checked } = e.target

    if (checked) {
      setFormData({
        ...formData,
        activities: [...formData.activities, value],
      })
    } else {
      setFormData({
        ...formData,
        activities: formData.activities.filter((activity) => activity !== value),
      })
    }
  }

  // Replace the validateForm function with this improved version
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validate based on active tab
    if (activeTab === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required"
        isValid = false
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address (e.g., name@example.com)"
        isValid = false
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
        isValid = false
      } else if (/[^0-9]/.test(formData.phone)) {
        newErrors.phone = "Phone number should contain only digits"
        isValid = false
      } else if (formData.phone.startsWith("0")) {
        newErrors.phone = "Phone number should not start with 0"
        isValid = false
      } else if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be exactly 10 digits"
        isValid = false
      }
    } else if (activeTab === 2) {
      if (!formData.origin.trim()) {
        newErrors.origin = "Origin is required"
        isValid = false
      }
      if (!formData.destination.trim()) {
        newErrors.destination = "Destination is required"
        isValid = false
      }
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required"
        isValid = false
      }
      if (!formData.duration) {
        newErrors.duration = "Duration is required"
        isValid = false
      }
      if (!formData.budget) {
        newErrors.budget = "Budget is required"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  // Update the handleNext function to show a toast with error summary
  const handleNext = () => {
    if (validateForm()) {
      setActiveTab(activeTab + 1)
    }
  }

  // Handle previous tab
  const handlePrev = () => {
    setActiveTab(activeTab - 1)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const requestData = {
        ...formData,
      }

      // Send data to backend API using apiEndpoints
      const response = await fetch(apiEndpoints.createCustomPackageRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitting(false)
        setIsSuccess(true)
      } else {
        throw new Error(data.message || "Failed to submit request")
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      setToast({
        show: true,
        message: "There was an error submitting your request. Please try again.",
        type: "error",
      })

      // Hide toast after 5 seconds
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" })
      }, 5000)

      setIsSubmitting(false)
    }
  }

  // Calculate minimum date (5 days from now)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 5)
  const minDateStr = minDate.toISOString().split("T")[0]

  // Calculate maximum date (1 year from now)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  return (
    <div className={`customize-modal-overlay ${isSubmitting ? "submitting" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: modalStyles }} />
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      {isSubmitting && (
        <div className="submission-animation">
          <div className="animation-content">
            <div className="spinner-container">
              <div className="spinner-circle"></div>
              <div className="spinner-circle-outer"></div>
            </div>
            <p>Sending your request...</p>
          </div>
        </div>
      )}

      <div className="customize-modal" ref={modalRef}>
        {isSuccess ? (
          <div className="success-message">
            <button className="close-success-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your custom package request has been submitted successfully.</p>
            <p>Our travel experts will contact you shortly.</p>
            <div className="success-timer">
              <div className="timer-bar"></div>
              <p className="timer-text">Closing in {countdown} second{countdown !== 1 ? "s" : ""}...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>
                <i className="fas fa-magic"></i> Customize Your Dream Trip
              </h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="progress-bar">
              <div className="progress-steps">
                <div className={`step ${activeTab >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Personal Info</div>
                </div>
                <div className={`step ${activeTab >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Trip Details</div>
                </div>
                <div className={`step ${activeTab >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Preferences</div>
                </div>
              </div>
              <div className="progress-line">
                <div className="progress-line-fill" style={{ width: `${((activeTab - 1) / 2) * 100}%` }}></div>
              </div>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Tab 1: Personal Information */}
                <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-user"></i> Personal Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "error" : ""}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>

                {/* Tab 2: Trip Details */}
                <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-map-marked-alt"></i> Trip Details
                  </h3>

                  <div className="form-group">
                    <label htmlFor="origin">
                      From <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className={errors.origin ? "error" : ""}
                      placeholder="Where are you traveling from?"
                    />
                    {errors.origin && <div className="error-message">{errors.origin}</div>}
                  </div>

                  <div className="form-group destination-group">
                    <label htmlFor="destination">
                      To <span className="required">*</span>
                    </label>
                    <div className="destination-input-wrapper">
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className={errors.destination ? "error" : ""}
                        placeholder="Where do you want to go?"
                        autoComplete="off"
                      />
                    </div>
                    {errors.destination && <div className="error-message">{errors.destination}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startDate">
                        Start Date <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={minDateStr}
                        max={maxDateStr}
                        className={errors.startDate ? "error" : ""}
                      />
                      {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="duration">
                        Duration <span className="required">*</span>
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={errors.duration ? "error" : ""}
                      >
                        <option value="">Select duration</option>
                        <option value="1-3">1-3 days</option>
                        <option value="4-7">4-7 days</option>
                        <option value="8-14">8-14 days</option>
                        <option value="15+">15+ days</option>
                      </select>
                      {errors.duration && <div className="error-message">{errors.duration}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="budget">
                        Budget (per person) <span className="required">*</span>
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={errors.budget ? "error" : ""}
                      >
                        <option value="">Select budget range</option>
                        <option value="0-20000">₹0 - ₹20,000</option>
                        <option value="20000-50000">₹20,000 - ₹50,000</option>
                        <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                        <option value="100000+">₹1,00,000+</option>
                      </select>
                      {errors.budget && <div className="error-message">{errors.budget}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="travelers">Number of Travelers</label>
                      <select id="travelers" name="travelers" value={formData.travelers} onChange={handleChange}>
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} {i === 0 ? "traveler" : "travelers"}
                          </option>
                        ))}
                        <option value="10+">10+ travelers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tab 3: Preferences */}
                <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-heart"></i> Preferences
                  </h3>

                  <div className="form-group">
                    <label>Preferred Activities</label>
                    <div className="activities-grid">
                      {activityOptions.map((activity) => (
                        <div className={`activity-checkbox ${formData.activities.includes(activity.id) ? "active" : ""}`} key={activity.id}>
                          <input
                            type="checkbox"
                            id={`modal-activity-${activity.id}`}
                            name="activities"
                            value={activity.id}
                            checked={formData.activities.includes(activity.id)}
                            onChange={handleActivityChange}
                          />
                          <label htmlFor={`modal-activity-${activity.id}`}>{activity.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="accommodation">Accommodation Preference</label>
                      <select
                        id="accommodation"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                      >
                        <option value="budget">Budget (2-3 star)</option>
                        <option value="standard">Standard (3-4 star)</option>
                        <option value="luxury">Luxury (4-5 star)</option>
                        <option value="ultra-luxury">Ultra Luxury (5 star+)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="transportation">Transportation Preference</label>
                      <select
                        id="transportation"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleChange}
                      >
                        <option value="public">Public Transportation</option>
                        <option value="private">Private Vehicle</option>
                        <option value="luxury">Luxury Transportation</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialRequests">Special Requests or Additional Information</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or anything else we should know..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              {activeTab > 1 && (
                <button type="button" className="prev-btn" onClick={handlePrev}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}

              {activeTab < 3 ? (
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CustomizePackageModal