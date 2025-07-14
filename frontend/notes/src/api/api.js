import axios from 'axios';

const api = axios.create({
  baseURL:'https://notes-x3w1.onrender.com/api',
});

// Inject token into headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
