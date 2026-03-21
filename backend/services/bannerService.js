const { Banner } = require('../models/bannerModel');

const getBanners = async () => {
    return await Banner.findAll({
        wehre : { is_active: true},
        order: [
            ['display_order', 'ASC'],
            ['created_at', 'DESC']
        ]
    });
};

module.exports = {getBanners};