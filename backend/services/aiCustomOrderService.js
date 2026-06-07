const { AiCustomOrder, AiGeneratedResult, User,AiJewelryComponent  } = require('../models');
const {Op, where} = require('sequelize');

const submitForQuote = async (userId, resultId) => {
    const result = await AiGeneratedResult.findByPk(resultId);

    if (!result) {
        throw new Error('AI design record not found in db.');
    }

    if (result.user_id !== null && result.user_id !== userId) {
        throw new Error('Unauthorized: This design belongs to another account.');
    }
    // prevent duplicate submissions for the same design
    const existingOrder = await AiCustomOrder.findOne({
        where: { result_id: resultId }
    });

    if (existingOrder) {
        throw new Error('This design has already been submitted for a quote.');
    }

    return await AiCustomOrder.create({
        user_id: userId,
        result_id: resultId,
        status: 'pending'
    });
};

const getAiCustomOrdersByUserId = async (userId, query, status) => {
    let whereClause = {
        user_id: userId
    };

    if (query) {
        whereClause[Op.or] = [
            { 
                id: { [Op.like]: `%${query}%` } 
            }, 
        ];
    }
    if (status) {
        whereClause.status = status;
    }

    const orders =  await AiCustomOrder.findAll({
        where: whereClause,
        include: [{
            model: AiGeneratedResult,
            as: 'aiResult',
            attributes: ['image_url', 'full_prompt', 'selections']
        }],
        order: [['updated_at', 'DESC']]
    });
    return await Promise.all(
        orders.map(async (order) => {
            const result = order.aiResult;

            //ensure selections is array
            const ids = Array.isArray(result.selections)
                ? result.selections
                : JSON.parse(result.selections);

            //fetch component names
            const components = await AiJewelryComponent.findAll({
                where: {
                    component_id: ids
                },
                attributes: ['component_id', 'name']
            });

            // rebuild response
            return {
                ...order.toJSON(),
                aiResult: {
                    image_url: result.image_url,
                    full_prompt: result.full_prompt,
                    selectedComponents: components.map(c => ({
                        id: c.component_id,
                        name: c.name
                    }))
                }
            };
        })
    );
};

const removeAiCustomOrder = async (userId, orderId) => {
    const order = await AiCustomOrder.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new Error("Order not found or unauthorized.");

    if (order.status === 'ordered') {
        throw new Error("Cannot remove an order that has already been paid for.");
    }
    return await order.destroy();
};

//admin
const getAllAiCustomOrder = async () => {
     const orders = await AiCustomOrder.findAll({
        include: [
            {
                model: AiGeneratedResult,
                as: 'aiResult',
                attributes: ['image_url', 'full_prompt', 'selections']
            },
            {
                model: User,
                as: 'User',
                attributes: ['name', 'email', 'phone_no']
            }
        ],  
        order: [['updated_at', 'DESC']]
    });

    return await Promise.all(
        orders.map(async (order) => {
            const result = order.aiResult;

            //ensure selections is array
            const ids = Array.isArray(result.selections)
                ? result.selections
                : JSON.parse(result.selections);

            //fetch component names
            const components = await AiJewelryComponent.findAll({
                where: {
                    component_id: ids
                },
                attributes: ['component_id', 'name']
            });

            // 3. rebuild response
            return {
                ...order.toJSON(),
                aiResult: {
                    image_url: result.image_url,
                    full_prompt: result.full_prompt,
                    selectedComponents: components.map(c => ({
                        id: c.component_id,
                        name: c.name
                    }))
                }
            };
        })
    );
}

const updateAiCustomOrder = async (id, adminData) => {
    const { status, admin_price, admin_note } = adminData;
    
    const order = await AiCustomOrder.findByPk(id);

    if (!order) {
        throw new Error("AI custom order not found.");
    }

    if (status === 'quoted') {
        if (admin_price == null || admin_price === '') {
            throw new Error("Price is required when quoting.");
        }

        order.admin_price = admin_price;
        order.admin_note = admin_note || null;
        order.status = 'quoted';
    }else if (status === 'declined') {
        if (!admin_note) {
            throw new Error("Note is required when declining order.");
        }
        order.admin_note = admin_note;
        order.admin_price = null;
        order.status = 'declined';
    }else if (status === 'ordered') {
        order.status = 'ordered';
    }else {
        throw new Error("Invalid status update.");
    }
    await order.save();
    return order;
};

const updateAiOrderStatus = async(id, status) => {
    return await AiCustomOrder.update(
        { status: status },
        { where: { id: id } }
    );
}

module.exports = {
    submitForQuote,
    getAiCustomOrdersByUserId,
    removeAiCustomOrder,
    getAllAiCustomOrder,
    updateAiCustomOrder,
    updateAiOrderStatus
};