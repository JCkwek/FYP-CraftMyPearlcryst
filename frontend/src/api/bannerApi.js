import api from './api'

export const getBanners = async () =>{
    const res  = await api.get(`/banners`);
    return res.data;
}