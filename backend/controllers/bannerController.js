const bannerService = require('../services/bannerService');

const getBanners = async (req,res) => {
    try{
        const banners = await bannerService.getBanners();
        res.json(banners);
    }catch(err){
        res.status(500).json({ message: 'Error fetching banners' });
    }
};

module.exports = {getBanners};