// API configuration
const API_CONFIG = {
  // BASE_URL: 'https://shahid-tan.vercel.app',
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    LOGIN: '/api/users/login',
    ME: '/api/users/me',
    MEGAMENU: '/api/megamenu/',
    TODAY_SALES: '/api/orders/today-sales'
  }
};

export default API_CONFIG;
