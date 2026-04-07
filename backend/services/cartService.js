const {Op, where} = require('sequelize');
const { CartItem, Product } = require('../models/index');

const addToCart = async (userId, productId, quantity, customization, finalPrice) => {
    const qtyToAdd = parseInt(quantity) || 1; //make sure quantity is number

    // fetch product details to get base price and custom rules
    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Product not found");

    // let finalPrice = parseFloat(product.product_price);

    // parse size rules for True-Per-Inch math
    // let sizeInfo = product.product_size;
    // if (typeof sizeInfo === 'string') {
    //     try { 
    //         sizeInfo = JSON.parse(sizeInfo); 
    //     } catch (e) { 
    //         sizeInfo = null; 
    //     }
    // }

    // calculate new price
    // if (sizeInfo?.type === 'range' && size) {
    //     const currentSize = parseFloat(size);
    //     const baseSize = parseFloat(sizeInfo.base);
    //     const unitPrice = parseFloat(sizeInfo.unitPrice || 0);

        // handles both increase and decrease 
    //     const diff = currentSize - baseSize;
    //     finalPrice += (diff * unitPrice);
    // }

    // ensure price never drops below a reasonable safety floor (e.g., RM 5)
    // finalPrice = Math.max(5.00, finalPrice);
    
    const priceToSave = Math.max(5.00, parseFloat(finalPrice) || product.product_price);

    const existingItem = await CartItem.findOne({
        where: {
            user_id: userId,
            product_id: productId,
            // size: size
            customization: customization
        }
    });

    if(existingItem){
        return await existingItem.increment('quantity', { by: qtyToAdd });
    }else{
        return await CartItem.create({
            user_id: userId,
            product_id: productId,
            quantity: qtyToAdd,
            // size,
            price_at_addition: priceToSave,
            customization: customization
        });
    }

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

const updateQuantity = async (userId, cartItemId, action) => {
    const item = await CartItem.findOne({where: {user_id: userId, cart_item_id: cartItemId}});
    if(!item) throw new Error("Item not found");

    if(action ==='increment'){
        return await item.increment('quantity', {by: 1});
    }else if(action ==='decrement'){
        if(item.quantity <= 1) return item; //dont go below 1
        return await item.decrement('quantity', {by: 1});
    }
};

const deleteCartItem = async (userId, cartItemId) => {
    console.log(`Service attempting to delete: User ${userId}, Item ${cartItemId}`);
    return await CartItem.destroy({
        where: {
            user_id: userId,
            cart_item_id: cartItemId
        }
    });
};

const clearCart = async (userId) => {
    return await CartItem.destroy({
        where: {user_id: userId}
    });
};

module.exports = {addToCart, getAllCartItem, updateQuantity, deleteCartItem ,clearCart}


