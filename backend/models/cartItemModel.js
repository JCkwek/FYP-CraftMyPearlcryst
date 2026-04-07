const { DataTypes } = require('sequelize');
const sequelize = require('../db');
// const {Product} = require('./productModel');

const CartItem = sequelize.define('CartItem', {
    cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'products', key: 'product_id'}
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    size: {
        type: DataTypes.STRING, // Use STRING to handle "5" (Ring) or "18" (Necklace)
        allowNull: true
    },
    customization: {
        type: DataTypes.JSON,
        allowNull: true
    },
    price_at_addition: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "The calculated price (Base + Customisation) at the time of adding to cart"
    }
}, {
    tableName: 'cart_items',
    timestamps: false
});

// CartItem.belongsTo(Product, { foreignKey: 'product_id' });
// Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.associate = (models) => {
    // A cart item belongs to a specific product
    CartItem.belongsTo(models.Product, { 
        foreignKey: 'product_id',
        as: 'Product' 
    });

    // A cart item belongs to a specific user
    CartItem.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'User'
    });
};
module.exports = CartItem;