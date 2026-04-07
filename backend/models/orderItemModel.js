const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customization: {
    type: DataTypes.JSON,
    allowNull: true
  },
  price_at_purchase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items', 
  timestamps: true,
  createdAt: 'createdAt',   
  updatedAt: 'updatedAt'   
});

OrderItem.associate = (models) => {

  console.log("DEBUG - Is Order a valid Model?", !!models.Order?.prototype);
    console.log("DEBUG - Is Product a valid Model?", !!models.Product?.prototype);
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'Order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'Product' });
};

module.exports =  OrderItem ;