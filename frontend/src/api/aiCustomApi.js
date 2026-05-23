import api from './api';


//admin
export const fetchAiComponents = async () => {
    const res = await api.get('/aicustomjewelry/admin/components');
    return res.data;
};