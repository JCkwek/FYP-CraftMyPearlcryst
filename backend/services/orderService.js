const { Order, OrderItem, Product, User, sequelize } = require('../models');
const {Op, where} = require('sequelize');

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

const stripeUpdateOrderStatus = async (sessionId, status) => {
    return await Order.update(
        { order_status: status },
        { where: {stripe_session_id: sessionId} }
    );
};

const getOrdersByUserId = async (userId, query, status) => {
    let whereClause = {
        user_id: userId
    };

    if (query) {
        whereClause[Op.or] = [
            { 
                order_id: { [Op.like]: `%${query}%` } 
            }, 
        ];
    }
    if (status) {
        whereClause.order_status = status;
    }

    return await Order.findAll({
        where: whereClause,
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

const getOrderDetailsBySessionId = async (stripeSessionId) => {
    return await Order.findOne({
        where: { stripe_session_id: stripeSessionId }
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

const getOrders = async ({ query, status, fromDate, toDate }) => {
    let whereClause = {};
    // search
    if (query) {
        whereClause[Op.or] = [
            { 
                order_id: { [Op.like]: `%${query}%` } 
            }, 
            {
                '$User.name$': { [Op.like]: `%${query}%` }
            }
        ];
    }
    // status filter
    if (status) {
        whereClause.order_status = status;
    }
    // date filter
    if (fromDate && toDate) {
        whereClause.createdAt = {
            [Op.between]: [fromDate, toDate]
        };
    } else if (fromDate) {
        whereClause.createdAt = {
            [Op.gte]: fromDate
        };
    } else if (toDate) {
        whereClause.createdAt = {
            [Op.lte]: toDate
        };
    }

    return await Order.findAll({
        where: whereClause,
        include: [
            {
                model: OrderItem,
                as: 'OrderItems',
                include: [{
                model: Product,
                as: 'Product'
                }]
            },
            {
                model: User, 
                as: 'User',
                attributes: ['user_id', 'name', 'email', 'phone_no']
            }
        ],
        order: [['createdAt', 'DESC']]
    });
};

const updateOrderStatus = async(orderId, status) => {
    return await Order.update(
        { order_status: status },
        { where: { order_id: orderId } }
    );
}

const payPendingOrder = async (orderId, userId) => {
    return await Order.findOne({
        where: { order_id: orderId, user_id: userId, order_status: 'pending' },
        include: [{
            model: OrderItem,
            as: 'OrderItems',
            include: [{
                model: Product,
                as: 'Product'
            }]
        }]
    });
};

const updateOrderSession = async (orderId, stripeSessionId) => {
    return await Order.update(
        { stripe_session_id: stripeSessionId },
        { where: { order_id: orderId } }
    );
};

module.exports = {
    createOrder,
    stripeUpdateOrderStatus,
    getOrdersByUserId,
    getOrderDetails,
    getMonthlySalesData,
    getOrders,
    updateOrderStatus,
    payPendingOrder,
    updateOrderSession,
    getOrderDetailsBySessionId
};

