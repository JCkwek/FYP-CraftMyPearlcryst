// const {CartItem}  = require('../models/cartItemModel');
const {Op, where} = require('sequelize');
// const { Product } = require('../models/productModel');
const { Product, CartItem } = require('../models')

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
        include: [{ 
            model: Product,
            as: 'Product'
         }]
     });
};

const updateQuantity = async (userId, productId, action) => {
    const item = await CartItem.findOne({where: {user_id: userId, product_id: productId}});
    if(!item) throw new Error("Item not found");

    if(action ==='increment'){
        return await item.increment('quantity', {by: 1});
    }else if(action ==='decrement'){
        if(item.quantity <= 1) return item; //dont go below 1
        return await item.decrement('quantity', {by: 1});
    }
};

const deleteCartItem = async (userId, productId) => {
    return await CartItem.destroy({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
};

const clearCart = async (userId) => {
    return await CartItem.destroy({
        where: {user_id: userId}
    });
};

module.exports = {addToCart, getAllCartItem, updateQuantity, deleteCartItem ,clearCart}


