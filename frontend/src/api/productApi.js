import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getProducts = async () => {
  const res = await axios.get(`${BASE_URL}/products`);
  return res.data; //returns array of products
};

export const searchProducts = async (query) =>{
  const res = await axios.get(`${BASE_URL}/products?q=${query}`);
  return res.data;
}
