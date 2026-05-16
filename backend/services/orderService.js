const { Order, OrderItem, Product, sequelize } = require('../models');

const createOrder = async (userId, cartItems, totalAmount, stripeSessionId) => {
    // Start a transaction to ensure both Order and OrderItems are saved together
    const t  = await sequelize.transaction();

    try{
        const order = await Order.create({
                user_id: userId,
                total_amount: totalAmount,
                order_status: 'pending',
                stripe_session_id: stripeSessionId
            }, {transaction: t}
        );
        const itemsData =cartItems.map(item => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_addition,
            customization: item.customization
        }))

        //create all OrderItems
        await OrderItem.bulkCreate(itemsData, {transaction: t});
        //commit transactions
        await t.commit();
        return order;
    }catch(err){
        await t.rollback(); //if anything fails, undo all database changes
        throw err;
    }
};

const updateOrderStatus = async (sessionId, status) => {
    return await Order.update(
        { order_status: status },
        { where: {stripe_session_id: sessionId} }
    );
};

const getOrdersByUserId = async (userId) => {
    return await Order.findAll({
        where: {user_id: userId},
        include: [{
            model: OrderItem,
            as: 'OrderItems',
            include: [{
            model: Product,
            as: 'Product'
            }]
        }],
        order: [['createdAt', 'DESC']]
    })
}

const getOrderDetails = async (orderId, userId) => {
    return await Order.findOne({
        where: { order_id: orderId, user_id: userId },
        include: [{ model: OrderItem, as: 'OrderItems' }]
    });
};

//admin
const getMonthlySalesData = async () => {
    return await Order.findAll({
        where: {
            order_status: ['paid', 'in-progress', 'completed'] 
        },
        attributes: [
            [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b'), 'month'], // Extract month name from timestamp
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'Sales'] // Sum total
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b')],
        order: [[sequelize.col('createdAt'), 'ASC']] 
    });
};

const getAllOrders = async () => {
    return await Order.findAll({
        order: [['createdAt', 'DESC']]
    })
}

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrdersByUserId,
    getOrderDetails,
    getMonthlySalesData
};

