import axios from "axios";

const BASE_URL = 'http://localhost:3000'; // backend URL

export const getBanners = async () =>{
    const res  = await axios.get(`${BASE_URL}/banners`);
    return res.data;
}