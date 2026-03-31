import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// runs BEFORE every request to add the token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// runs AFTER every response to check for 401 errors (Expired Token)
api.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Token expired. Logging out...");
            
            // Clear storage
            localStorage.removeItem('token');
            localStorage.setItem('user', null); 
            
            // Force user to Login
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;