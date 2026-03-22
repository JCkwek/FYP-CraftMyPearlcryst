const { Product } = require('../models/productModel');
const {Op, where} = require('sequelize');

const getProducts = async ({ query, type, onlyAvailable, limit, latest }) => {
    let whereClause = {};
    // search
    if (query) {
        whereClause.product_name = {
            [Op.like]: `%${query}%`
        };
    }
    // filter by type
    if (type) {
        whereClause.product_type = type;
    }
    // availability filter
    if (onlyAvailable === true) {
        whereClause.product_availability = true;
    }
    return await Product.findAll({
        where: whereClause,
        //latest products
        order: latest? [['created_at', 'DESC']] : [],
        //set number of products
        ...(limit && {limit})
    });
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
};

module.exports = { getProducts, getProductById };
