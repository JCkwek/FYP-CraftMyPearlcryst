import api from './api';

export const submitForQuote = async (resultId) => {
    const res = await api.post('/aicustomorder/submit-quote', { resultId })
    return res.data;
}

export const fetchAiCustomOrder = async (filters = {}) => {
    const res = await api.get('/aicustomorder/my-aicustom-orders', {
        params: filters
    });
    return res.data;
}

export const removeAiCustomOrder = async (orderId) => {
    const res = await api.delete(`/aicustomorder/delete/${orderId}`);
    return res.data;
};

//admin
export const getAllAiCustomOrder = async () => {
    const res = await api.get('/aicustomorder/admin/allAiCustomOrders')
    return res.data;
}

export const updateAiCustomOrder = async (id,data) => {
    const res = await api.patch(`/aicustomorder/admin/update/${id}`, data)
    return res.data;
}

export const updateAiOrderStatus = async (id, status) => {
    const res = await api.put(`/orders/admin/updateaiOrderStatus/${id}`, {status});
    return res.data;
}




