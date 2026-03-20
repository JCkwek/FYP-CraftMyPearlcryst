import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getUsers = async () => {
  const res = await axios.get(`${BASE_URL}/users`);
  return res.data; //returns array of users
};

export const createUser = async (name) => {
  const res = await axios.post(`${BASE_URL}/users`, { name });
  return res.data;
};