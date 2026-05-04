// import axios from 'axios';
import api from "./api";

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getUsers = async () => {
  const res = await api.get(`${BASE_URL}/users`);
  return res.data; //returns array of users
};

export const createUser = async (name) => {
  const res = await api.post(`${BASE_URL}/users`, { name });
  return res.data;
};

export const updateProfile = async (formData) => {
    const token = localStorage.getItem('token');
    const res = await api.put(`/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const registerUser = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
};