const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  product_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  product_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  product_availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  product_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  product_material: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_customisable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Most items (like rings) aren't customisable by default
    allowNull: false
  },
  created_at: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',   
  updatedAt: 'updated_at'
});

Product.associate = (models) => {
    Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'OrderItems' });
    Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'CartItems' });
};

module.exports =  Product ;