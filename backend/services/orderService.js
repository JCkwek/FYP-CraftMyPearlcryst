const { Order } = require('../models/orderModel');
const { OrderItem } = require('../models/orderItemModel');
const sequelize = require('../db');

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
            price_at_purchase: item.Product.product_price
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
        where: { user_id: userId },
        include: ['OrderItems'],
        order: [['createdAt', DESC]]
    });
};

const getOrderDetails = async (orderId, userId) => {
    return await Order.findOne({
        where: { order_id: orderId, user_id: userId },
        include: [{ model: OrderItem, as: 'OrderItems' }]
    });
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrdersByUserId,
    getOrderDetails
};

