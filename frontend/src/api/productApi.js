import api from './api';

export const getProducts = async ({query, type, onlyAvailable, limit, latest}) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (type) params.append('type', type);
  if (onlyAvailable) params.append('available', 'true');
  if (limit) params.append('limit', limit);
  if (latest) params.append('latest', 'true');

  const res = await api.get(`/products?${params.toString()}`);
  return res.data; //array of products
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

//admin
export const addProduct = async (formDataPayload) => {
  const res = await api.post(`/products/admin/addProduct`, formDataPayload);
  return res.data;
};