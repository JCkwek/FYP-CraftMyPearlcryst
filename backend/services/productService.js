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
    if (type) {
        whereClause.product_type = type;
    }
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

// const getProductById = async (id) => {
//     const product = await Product.findByPk(id, {
//         include: [
//             {
//                 model: CustomizationOption,
//                 as: 'options',
//                 where: { is_active: 1 },
//                 required: false,
//                 include: [
//                     {
//                         model: OptionValue,
//                         as: 'values',
//                         where: { is_active: 1 },
//                         required: false
//                     }
//                 ]
//             }
//         ]
//     });

//     if (!product) return null;

//     const data = product.toJSON();

//     // normalize range
//     data.options = data.options?.map(opt => {
//         if (opt.option_type === 'range') {
//             return {
//                 ...opt,
//                 values: [] // clean unused list data
//             };
//         }
//         return opt;
//     });

//     return data;
// };

const getProductById = async (id) => {
    const product = await Product.findByPk(id, {
        include: [
            {
                model: CustomizationOption,
                as: 'options',
                where: { is_active: 1 },
                required: false,
                include: [
                    {
                        model: OptionValue,
                        as: 'values',
                        where: { is_active: 1 },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!product) return null;

    const data = product.toJSON();

    // normalize range options
    data.options = data.options?.map(opt => {
        if (opt.option_type === 'range') {
            return { ...opt, values: [] };
        }
        return opt;
    }) || [];

    // 🔥 FIX: inject product_size as "list option" if no options exist
    if (data.options.length === 0 && data.product_size) {
        let sizes = [];

        try {
            sizes = JSON.parse(data.product_size);
        } catch (e) {
            sizes = [];
        }

        if (sizes.length > 0) {
            data.options.push({
                option_id: null,
                option_name: "Size",
                option_type: "list",
                values: sizes.map(s => ({
                    value_id: s,
                    visual_value: s
                }))
            });
        }
    }

    return data;
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
        // option_type,
        // sizeInput,
        // range_min,
        // range_max,
        // range_step,
        // default_value
         customizations = []
    } = productData;

    const isCustomisable =
        is_customisable === 'true' || is_customisable === true;

    return await sequelize.transaction(async (t) => {

        const newProduct = await Product.create({
            product_name,
            product_price,
            product_desc,
            product_image,
            product_availability:
            product_availability === 'true' || product_availability === true,
            product_type,
            product_material,
            is_customisable: isCustomisable,
        }, { transaction: t });

        // if (isCustomisable) {
        //     const option = await CustomizationOption.create({
        //         product_id: newProduct.product_id,
        //         option_name: "Size",
        //         option_type,
        //         is_active: 1,
        //         default_value: default_value || null,
        //         range_min: option_type === "range" ? range_min : null,
        //         range_max: option_type === "range" ? range_max : null,
        //         range_step: option_type === "range" ? range_step : null
        //     }, { transaction: t });

        //     if (option_type === "list" && sizeInput?.trim()) {
        //         const values = sizeInput
        //             .split(",")
        //             .map(v => v.trim())
        //             .filter(Boolean);

        //         await Promise.all(
        //             values.map(v =>
        //                 OptionValue.create({
        //                     option_id: option.option_id,
        //                     value_label: v,
        //                     visual_value: v,
        //                     is_active: 1
        //                 }, { transaction: t })
        //             )
        //         );
        //     }
        // }

        if (isCustomisable && Array.isArray(customizations)) {
            const seen = new Set();
            for (const c of customizations) {
                if (seen.has(c.option_name)) {
                    throw new Error(`Duplicate option: ${c.option_name}`);
                }
                seen.add(c.option_name);
            }
            
            for (const c of customizations) {
                const option = await CustomizationOption.create({
                    product_id: newProduct.product_id,
                    option_name: c.option_name,
                    option_type: c.option_type,
                    is_active: 1,

                    // RANGE FIELDS
                    range_min: c.option_type === 'range' ? c.range_min : null,
                    range_max: c.option_type === 'range' ? c.range_max : null,
                    range_step: c.option_type === 'range' ? c.range_step : null,
                    default_value: c.default_value || null
                }, { transaction: t });

                // LIST TYPE
                if (c.option_type === 'list' && c.values) {
                    const values = c.values
                        .split(',')
                        .map(v => v.trim())
                        .filter(Boolean);

                    await Promise.all(
                        values.map(v =>
                            OptionValue.create({
                                option_id: option.option_id,
                                value_label: v,
                                visual_value: v,
                                is_active: 1
                            }, { transaction: t })
                        )
                    );
                }
            }
        }

        return newProduct;
    });
};

const updateProduct = async (id, productData) => {
    const {
        product_name,
        product_price,
        product_desc,
        product_image,
        product_availability,
        product_type,
        product_material,
        is_customisable,
        // option_type,
        // sizeInput,
        // range_min,
        // range_max,
        // range_step,
        // default_value
        customizations = []
    } = productData;

    // const optionType = productData.option_type;
    const isCustomisable =
        is_customisable === 'true' || is_customisable === true;

    return await sequelize.transaction(async (t) => {
        const product = await Product.findByPk(id, { transaction: t });
        if (!product) throw new Error('Product not found');

        const updateFields = {
            product_name,
            product_price,
            product_desc,
            product_type,
            product_material,
            product_availability: product_availability === 'true' || product_availability === true,
            is_customisable: isCustomisable,
        };

        if (product_image) {
            updateFields.product_image = product_image;
        }

        await product.update(updateFields, { transaction: t });

        // if (updateFields.is_customisable) {
        //     let option;
        //     option = await CustomizationOption.findOne({
        //         where: {
        //             product_id: id,
        //             option_name: 'Size'
        //         },
        //         transaction: t
        //     });

        //     // Create option if not exists
        //     if (!option) {
        //         option = await CustomizationOption.create({
        //             product_id: id,
        //             option_name: 'Size',
        //             option_type: optionType,
        //             is_active: 1
        //         }, { transaction: t });
        //     }
        //     await option.update(
        //         {
        //             option_type: optionType,
        //             is_active: 1
        //         },
        //         { transaction: t }
        //     );

        //     // sync option type
        //     await option.update(
        //         { option_type: optionType },
        //         { transaction: t }
        //     );
            
        //     //type list
        //     if (optionType === 'list') {
        //             await OptionValue.destroy({
        //                 where: { option_id: option.option_id },
        //                 transaction: t
        //             });
        //             await option.update(
        //                 { default_value },
        //                 { transaction: t }
        //             );
        //         const parsedSizes = sizeInput
        //             ? sizeInput.split(',').map(s => s.trim())
        //             : [];

        //         // recreate values
        //         await Promise.all(
        //             parsedSizes.map(size =>
        //                 OptionValue.create({
        //                     option_id: option.option_id,
        //                     value_label: size,
        //                     visual_value: size,
        //                     is_active: 1
        //                 }, { transaction: t })
        //             )
        //         );
        //     }

        //     //type range
        //     if (optionType === 'range') {
        //         await OptionValue.destroy({
        //             where: { option_id: option.option_id },
        //             transaction: t
        //         });

        //         const rangeUpdate = {};
        //         if (productData.range_min !== undefined)
        //             rangeUpdate.range_min = productData.range_min;
        //         if (productData.range_max !== undefined)
        //             rangeUpdate.range_max = productData.range_max;
        //         if (productData.range_step !== undefined)
        //             rangeUpdate.range_step = productData.range_step;
        //         if (productData.default_value !== undefined)
        //             rangeUpdate.default_value = productData.default_value;
        //         await option.update(rangeUpdate, { transaction: t });
        //     }

        // } else {
        //     // disable customization
        //     await CustomizationOption.update(
        //         { is_active: 0 },
        //         {
        //             where: { product_id: id },
        //             transaction: t
        //         }
        //     );
        // }
        // REMOVE OLD OPTIONS FIRST
        const options = await CustomizationOption.findAll({
            where: { product_id: id },
            transaction: t
        });

        const optionIds = options.map(o => o.option_id);

        // delete option values first
        if(optionIds.length > 0){
            await OptionValue.destroy({
                where: {
                    option_id: optionIds
                },
                transaction: t
            });
        }


        // delete options
        await CustomizationOption.destroy({
            where: { product_id: id },
            transaction: t
        });

        // REBUILD FROM NEW STRUCTURE
        if (isCustomisable && Array.isArray(customizations)) {
            for (const c of customizations) {
                const option = await CustomizationOption.create({
                    product_id: id,
                    option_name: c.option_name,
                    option_type: c.option_type,
                    is_active: 1,
                    range_min: c.range_min || null,
                    range_max: c.range_max || null,
                    range_step: c.range_step || null,
                    default_value: c.default_value || null
                }, { transaction: t });

                if (c.option_type === 'list' && c.values) {
                    const values = c.values
                        .split(',')
                        .map(v => v.trim())
                        .filter(Boolean);

                    await Promise.all(
                        values.map(v =>
                            OptionValue.create({
                                option_id: option.option_id,
                                value_label: v,
                                visual_value: v,
                                is_active: 1
                            }, { transaction: t })
                        )
                    );
                }
            }
        }

        return product;
    });
};

const deleteProduct = async (id) => {
    return await sequelize.transaction(async (t) => {
        const product = await Product.findByPk(id, { transaction: t });

        if (!product) {
            throw new Error('Product not found');
        }

        // delete option values first (child table)
        const options = await CustomizationOption.findAll({
            where: { product_id: id },
            transaction: t
        });

        for (const opt of options) {
            await OptionValue.destroy({
                where: { option_id: opt.option_id },
                transaction: t
            });
        }

        // delete customization options
        await CustomizationOption.destroy({
            where: { product_id: id },
            transaction: t
        });

        // delete product
        await Product.destroy({
            where: { product_id: id },
            transaction: t
        });

        return true;
    });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct};
