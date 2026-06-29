import api from './api';

export const getCart = async () => {
    const res = await api.get('/cart');
    return res.data;
};

export const addToCart = async (cartData) => {
  const res = await api.post('/cart', cartData);
  return res.data;
};

export const updateCartQuantity = async (cartItemId, action) => {
    const res = await api.put('/cart/update', { cartItemId, action });
    return res.data;
};

export const deleteCartItem = async (cartItemId) => {
    const res = await api.delete(`/cart/${cartItemId}`);
    return res.data;
};

