import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getProducts = async () => {
  const res = await axios.get(`${BASE_URL}/products`);
  return res.data; //returns array of products
};

