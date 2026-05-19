// const { Product } = require('../models/productModel');
const { Product, CustomizationOption, OptionValue, sequelize } = require('../models');
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
        product_availability,
        product_type,
        product_material,
        is_customisable,
        product_size // Sequelize automatically strings and parse DataTypes.JSON column
    });

    return newProduct;
};

const updateProduct = async (id, productData) => {
    const {
        product_name,
        product_price,
        product_desc,
        product_image, // This will be the new URL string if a file was uploaded
        product_availability,
        product_type,
        product_material,
        is_customisable,
        product_size // Passed as a JSON array or parsed string array
    } = productData;

    // Start a managed Sequelize transaction
    return await sequelize.transaction(async (t) => {
        // check if product exists
        const product = await Product.findByPk(id, { transaction: t });
        if (!product) {
            throw new Error('Product not found');
        }

        const updateFields = {
            product_name,
            product_price,
            product_desc,
            product_type,
            product_material,
            product_availability: product_availability === 'true' || product_availability === true,
            is_customisable: is_customisable === 'true' || is_customisable === true,
        };

        // CRITICAL: Only overwrite the image path if a new file was sent from Multer
        if (product_image) {
            updateFields.product_image = product_image;
        }

        // Handle stringified JSON safety depending on middleware parsing setup
        if (product_size) {
            updateFields.product_size = typeof product_size === 'string' 
                ? JSON.parse(product_size) 
                : product_size;
        }

        await product.update(updateFields, { transaction: t });

        // handle Sub-relational Customization Options Context Updates
        if (updateFields.is_customisable) {
            // Check if a size/length customization row already exists for this product
            let sizeOption = await CustomizationOption.findOne({
                where: {
                    product_id: id,
                    option_name: { [Op.like]: '%Size%' }
                },
                transaction: t
            });

            if (!sizeOption) {
                // If it transitioned from non-customizable to customizable, create the configuration row
                sizeOption = await CustomizationOption.create({
                    product_id: id,
                    option_name: 'Size Selection',
                    option_type: 'list',
                    is_active: 1
                }, { transaction: t });
            }

            // Sync values if product_size modifications were sent along
            if (updateFields.product_size && Array.isArray(updateFields.product_size)) {
                await OptionValue.update(
                    { is_active: 0 },
                    { where: { option_id: sizeOption.option_id }, transaction: t }
                );

                // Insert updated values
                const valuePromises = updateFields.product_size.map((size) => {
                    return OptionValue.create({
                        option_id: sizeOption.option_id,
                        visual_value: size,
                        value_label: size,
                        is_active: 1
                    }, { transaction: t });
                });
                await Promise.all(valuePromises);
            }
        } else {
            // If admin unchecked customization, existing option sets as inactive
            await CustomizationOption.update(
                { is_active: 0 },
                { where: { product_id: id }, transaction: t }
            );
        }
        return product;
    });
}

module.exports = { getProducts, getProductById, createProduct, updateProduct};
