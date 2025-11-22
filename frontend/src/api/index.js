import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});

// User Routes
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users', formData);

// Question Routes
export const fetchQuestions = (category, field) => {
  let url = `/questions?category=${category}`;
  if (field) {
    url += `&field=${encodeURIComponent(field)}`;
  }
  return API.get(url);
};

export const evaluateAnswer = (keywords, userAnswer) => API.post('/questions/evaluate', { keywords, userAnswer });