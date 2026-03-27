const User = require('./userModel');
const Product = require('./productModel');
const  Order  = require('./orderModel'); 
const OrderItem = require('./orderItemModel');
const  CartItem  = require('./cartItemModel');
const sequelize = require('../db');

const models = { User, Product, Order, OrderItem, CartItem };

// THIS PART IS CRITICAL:
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Associating: ${modelName}`); // Add this to your terminal to verify!
    models[modelName].associate(models);
  }
});

module.exports = { ...models, sequelize };


// const sequelize = require('../db');
// const { DataTypes } = require('sequelize');

// const {User} = require('./userModel');

// module.exports = {
//     User
// };

// const sequelize = require('../db');
// const { DataTypes } = require('sequelize');

// //Import all models
// const User = require('./userModel');
// const Product = require('./productModel');
// const Order = require('./orderModel');
// const OrderItem = require('./OrderItem');
// const { CartItem } = require('./cartItemModel');

// //Define Relationships 

// // User <-> Order
// User.hasMany(Order, { foreignKey: 'user_id' });
// Order.belongsTo(User, { foreignKey: 'user_id' });

// // Order <-> OrderItem
// Order.hasMany(OrderItem, { foreignKey: 'order_id' });
// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// // OrderItem <-> Product
// OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
// Product.hasMany(OrderItem, { foreignKey: 'product_id' });

// // CartItem <-> Product
// CartItem.belongsTo(Product, { foreignKey: 'product_id' });
// Product.hasMany(CartItem, { foreignKey: 'product_id' });

// // 3. Export everything from this one "Hub"
// module.exports = {
//     User,
//     Product,
//     Order,
//     OrderItem,
//     CartItem,
//     sequelize
// };