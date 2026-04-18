const User = require('./userModel');
const Product = require('./productModel');
const  Order  = require('./orderModel'); 
const OrderItem = require('./orderItemModel');
const  CartItem  = require('./cartItemModel');
const CustomizationOption = require('./customizationOptionsModel');
const OptionValue = require('./optionValueModel');
const AIJewelryComponent = require('./aiJewelryComponentModel');
const AIGeneratedResult = require('./aiGeneratedResultModel');
const sequelize = require('../db');

const models = { 
  User, 
  Product, 
  Order, 
  OrderItem, 
  CartItem, 
  CustomizationOption, 
  OptionValue,
  AIJewelryComponent,
  AIGeneratedResult
};

// CRITICAL:
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Associating: ${modelName}`); // Add this to terminal to verify
    models[modelName].associate(models);
  }
});

module.exports = { ...models, sequelize };
