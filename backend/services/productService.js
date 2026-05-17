// const { Product } = require('../models/productModel');
const { Product, CustomizationOption, OptionValue } = require('../models');
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
        include: [
            {
                model: CustomizationOption,
                as: 'options',
                where: {is_active: 1},
                required: false, //show product even if no options
                include: [
                    {
                        model: OptionValue,
                        as: 'values',
                        where: {is_active: 1},
                        required: false
                    }
                ]
            }
        ],
        //latest products
        order: latest? [['created_at', 'DESC']] : [],
        //set number of products
        ...(limit && {limit})
    });
};

const getProductById = async (id) => {
    return await Product.findByPk(id, {
        include: [
            {
                model: CustomizationOption,
                as: 'options',
                where: {is_active: 1},
                required: false, //show product even if no options
                include: [
                    {
                        model: OptionValue,
                        as: 'values',
                        where: {is_active: 1},
                        required: false
                    }
                ]
            }
        ]
    });
};

//admin
const createProduct = async (productData) => {
    const {
        product_name,
        product_price,
        product_desc,
        product_image,
        product_availability,
        product_type,
        product_material,
        is_customisable,
        product_size
    } = productData;

    const newProduct = await Product.create({
        product_name,
        product_price,
        product_desc,
        product_image,
        // product_availability: product_availability !== undefined ? product_availability : true,
        product_availability,
        product_type,
        product_material,
        // is_customisable: is_customisable !== undefined ? is_customisable : false,
        is_customisable,
        product_size // Sequelize automatically strings and parse DataTypes.JSON column
    });

    return newProduct;
};

module.exports = { getProducts, getProductById, createProduct};
