const { Product } = require('../models/productModel');
const {Op, where} = require('sequelize');

const getProducts = async ({ query, type, onlyAvailable }) => {
    let whereClause = {};

    // search
    if (query) {
        whereClause.product_name = {
            [Op.like]: `%${query}%`
        };
    }

    // filter by type (bracelet, necklace, etc.)
    if (type) {
        whereClause.product_type = type;
    }

    // availability filter
    if (onlyAvailable === true) {
        whereClause.product_availability = true;
    }

    return await Product.findAll({
        where: whereClause
    });
};
module.exports = { getProducts};
