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
export const updateAiComponent = async (id, data) => {
    const res = await api.put(`/aicustomjewelry/admin/components/${id}`, data);
    return res.data;
};

export const addAiComponent = async (data) => {
    const res = await api.post(`/aicustomjewelry/admin/components`, data);
    return res.data;
};