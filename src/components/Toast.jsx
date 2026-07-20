import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const toastStyles = `
  .toast-wrapper { position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 12px; pointer-events: none; width: 100%; max-width: 420px; }
  .toast-container { min-width: 320px; width: 100%; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; animation: slideIn 0.3s ease-out; border-left: 4px solid #f99b66; transition: all 0.3s ease; pointer-events: auto; position: relative; }
  .toast-container.success { border-left-color: #f99b66; }
  .toast-container.error   { border-left-color: #ef4444; }
  .toast-container.warning { border-left-color: #f59e0b; }
  .toast-container.info    { border-left-color: #f99b66; }
  .toast-container.fade-out { animation: slideOut 0.3s ease-in forwards; }
  .toast-content { display: flex; align-items: center; padding: 16px; gap: 12px; }
  .toast-icon { flex-shrink: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
  .toast-container.success .toast-icon { color: #f99b66; }
  .toast-container.error   .toast-icon { color: #ef4444; }
  .toast-container.warning .toast-icon { color: #f59e0b; }
  .toast-container.info    .toast-icon { color: #f99b66; }
  .toast-message { flex: 1; font-size: 14px; line-height: 1.5; color: #1f2937; font-weight: 500; }
  .toast-close { flex-shrink: 0; background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s ease; }
  .toast-close:hover { background: #f3f4f6; color: #4b5563; }
  .toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; background: #f99b66; animation: progress linear forwards; transform-origin: left; }
  .toast-container.success .toast-progress { background: #f99b66; }
  .toast-container.error   .toast-progress { background: #ef4444; }
  .toast-container.warning .toast-progress { background: #f59e0b; }
  .toast-container.info    .toast-progress { background: #f99b66; }
  @keyframes slideIn   { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  @keyframes progress  { from { transform: scaleX(1); } to { transform: scaleX(0); } }
  @media (max-width: 480px) { .toast-wrapper { left: 10px; right: 10px; top: 10px; width: calc(100% - 20px); max-width: none; } .toast-content { padding: 12px; } .toast-message { font-size: 13px; } }
`

function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [wrapperElement, setWrapperElement] = useState(null);

  useEffect(() => {
    // Dynamically find or create the toast-wrapper element in client-side document body
    let wrapper = document.getElementById("toast-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "toast-wrapper";
      wrapper.className = "toast-wrapper";
      document.body.appendChild(wrapper);
    }
    setWrapperElement(wrapper);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Match the animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // SSR safety guard
  if (!wrapperElement) return null;

  // Render the toast inside our single shared toast-wrapper portal
  return ReactDOM.createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: toastStyles }} />
      <div className={`toast-container ${type} ${isExiting ? "fade-out" : ""}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === "success" && <i className="fas fa-check-circle"></i>}
          {type === "error" && <i className="fas fa-exclamation-circle"></i>}
          {type === "info" && <i className="fas fa-info-circle"></i>}
          {type === "warning" && (
            <i className="fas fa-exclamation-triangle"></i>
          )}
        </div>
        <div className="toast-message">{message}</div>
        <button
          className="toast-close"
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
      ></div>
      </div>
    </>,
    wrapperElement
  );
}

// Create a toast manager to handle multiple toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const hideToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    // Toast components will dynamically portal themselves to our shared #toast-wrapper
    return (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </>
    );
  };

  return {
    showToast,
    hideToast,
    ToastContainer,
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    info: (message, duration) => showToast(message, "info", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
  };
};

export default Toast;
