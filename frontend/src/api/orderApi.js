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