import api from './api';


//admin
export const fetchAiComponents = async () => {
    const res = await api.get('/aicustomjewelry/admin/components');
    return res.data;
};
export const fetchAiOptionRequirements = async () => {
    const res = await api.get('/aicustomjewelry/admin/requirements');
    return res.data;
};