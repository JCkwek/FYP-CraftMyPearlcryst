const rotateService = require('../services/rotateImageService');

const getRotateImage = async (req,res) => {
    try{
        const images = await rotateService.getRotateImages();
        res.json(images);
    }catch(err){
        res.status(500).json({ message: 'Error fetching rotating images' });
    }
};

module.exports = {getRotateImage};