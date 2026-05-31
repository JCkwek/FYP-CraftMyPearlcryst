import api from './api';
export const getUserOrder = async () => {
    const res = await api.get('/orders');
    return res.data;
}

//admin
export const getSalesData = async () => {
    const res = await api.get('/orders/admin/salesData');
    return res.data;
};

export const getOrders = async () => {
    const res = await api.get('/orders/admin/allOrders');
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const res = await api.put(`/orders/admin/updateOrderStatus/${orderId}`, {status});
    return res.data;
}