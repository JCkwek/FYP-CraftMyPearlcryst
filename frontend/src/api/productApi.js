import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getProducts = async ({query, type, onlyAvailable, limit, latest}) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (type) params.append('type', type);
  if (onlyAvailable) params.append('available', 'true');
  if (limit) params.append('limit', limit);
  if (latest) params.append('latest', 'true');

  const res = await axios.get(`${BASE_URL}/products?${params.toString()}`);
  return res.data; //returns array of products
};

