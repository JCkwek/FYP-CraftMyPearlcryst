import api from './api';

export const getSalesData = async () => {
    const res = await api.get('/orders/admin/salesData');
    return res.data;
};
