const isProduction = import.meta.env.MODE === 'production';

const API_BASE_URL = isProduction 
  ? 'https://topcorner-backend.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;