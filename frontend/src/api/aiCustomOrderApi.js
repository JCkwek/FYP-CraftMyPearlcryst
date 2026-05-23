import api from './api';

export const submitForQuote = async (resultId) => {
    const res = await api.post('/aicustomorder/submit-quote', { resultId })
    return res.data;
}

export const fetchAiCustomOrder = async () => {
    const res = await api.get('/aicustomorder/my-aicustom-orders')
    return res.data;
}

export const removeAiCustomOrder = async (orderId) => {
    const res = await api.delete(`/aicustomorder/${orderId}`);
    return res.data;
};
