// This allows the client to dynamically connect to the correct API URL based on environment

// Dynamically determine the backend URL based on the current hostname
const getBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const hostname = window.location.hostname;

  // Determine if accessing from localhost/127.0.0.1
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

  let configUrl = '';
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    configUrl = import.meta.env.VITE_API_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    configUrl = process.env.REACT_APP_API_URL;
  }

  // If a configuration exists, use it only if we're on localhost, OR if the configured URL is NOT pointing to localhost.
  // This ensures that accessing the dev server over LAN or tunnels dynamically points to the LAN/tunnel backend.
  if (configUrl && (isLocalHost || (!configUrl.includes('localhost') && !configUrl.includes('127.0.0.1')))) {
    return configUrl;
  }

  // If running through a VS Code/Tunnel forwarded hostname, the frontend host may be different from the backend host.
  // The tunnel assigns a separate hostname per forwarded port, so the backend URL is usually not the same hostname with :5000.
  if (hostname.includes('.devtunnels.ms')) {
    const tunnelMatch = hostname.match(/-(\d+)\.inc1\.devtunnels\.ms$/);
    if (tunnelMatch) {
      return `${protocol}//${hostname.replace(`-${tunnelMatch[1]}.inc1.devtunnels.ms`, '-5000.inc1.devtunnels.ms')}`;
    }
  }

  if (!isLocalHost && !hostname.includes('prathamtours.com') && !hostname.includes('vercel.app')) {
    return `${protocol}//${hostname}:5000`;
  }

  return `${protocol}//127.0.0.1:5000`;
};

const API_BASE_URL = getBaseUrl();

export const getApiUrl = () => API_BASE_URL

export const apiEndpoints = {
  // Public endpoints
  getAllPackages: `${API_BASE_URL}/api/packages`,
  getPackageById: (id) => `${API_BASE_URL}/api/packages/${id}`,
  createBooking: `${API_BASE_URL}/api/bookings`,
  createBookingRequest: `${API_BASE_URL}/api/booking-requests`,
  createCustomPackageRequest: `${API_BASE_URL}/api/submit-custom-package`,
  getDestinations: `${API_BASE_URL}/api/destinations`,

  // Payment endpoints
  createOrder: `${API_BASE_URL}/api/create-order`,
  verifyPayment: (orderId) => `${API_BASE_URL}/api/verify-payment/${orderId}`,

  // Receipt and booking management endpoints
  saveBooking: `${API_BASE_URL}/api/save-booking`,
  sendReceipt: `${API_BASE_URL}/api/send-receipt`,
  generateReceipt: `${API_BASE_URL}/api/generate-receipt`,
  healthCheck: `${API_BASE_URL}/api/ha`,
  contact: `${API_BASE_URL}/api/contact`,
  settings: `${API_BASE_URL}/api/settings`,
}

export const getImageUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  
  // Fully decode HTML entities that might have been double/triple encoded by the backend
  let decodedUrl = url;
  // Loop to resolve multiple levels of &amp; encoding
  while (decodedUrl.includes('&amp;')) {
    decodedUrl = decodedUrl.replace(/&amp;/g, '&');
  }
  decodedUrl = decodedUrl
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/ig, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");

  // Clean up any stray quotes that might have been added by JSON stringification issues
  const cleanUrl = decodedUrl.replace(/^["']|["']$/g, '');
  
  if (cleanUrl.startsWith('http')) return cleanUrl;
  if (cleanUrl.startsWith('/uploads')) return `${API_BASE_URL}${cleanUrl}`;
  return cleanUrl;
}

export default API_BASE_URL
