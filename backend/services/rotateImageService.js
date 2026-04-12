const { RotatingImage } = require('../models/rotateImageModel');

const getRotateImages = async () => {
    return await RotatingImage.findAll({
        where : { is_active: true},
        order: [
            ['display_order', 'ASC']
        ]
    });
};

module.exports = {getRotateImages};