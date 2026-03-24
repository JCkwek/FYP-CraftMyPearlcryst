const  {CartItem}  = require('../models/cartItemModel');
const {Op, where} = require('sequelize');
const { Product } = require('../models/productModel');

const addToCart = async (userId, productId, quantity) => {
    const qtyToAdd = parseInt(quantity) || 1; //make sure quantity is number

    const existingItem = await CartItem.findOne({
        where: {
            user_id: userId,
            product_id: productId,
        }
    });

    if(existingItem){
        return await existingItem.increment('quantity', { by: qtyToAdd });
        // existingItem.quantity += quantity;
        // await existingItem.save();
        // return existingItem;
    }

    return await CartItem.create({
        user_id: userId,
        product_id: productId,
        quantity: qtyToAdd
    });

};

const getAllCartItem = async(userId) => {
     return await CartItem.findAll({
        where: {user_id: userId},
        include: [{ model: Product }]
     });
};

module.exports = {addToCart, getAllCartItem}


