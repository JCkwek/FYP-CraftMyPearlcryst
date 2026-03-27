const { DataTypes } = require('sequelize');
const sequelize = require('../db');

    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        order_status: {
            type: DataTypes.ENUM('pending', 'paid', 'in-progress', 'cancelled', 'completed'),
            defaultValue: 'pending'
        },
        stripe_session_id: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'orders', 
        timestamps: true   
    });

    Order.associate = (models) => {
        // One order belongs to one user
        Order.belongsTo(models.User, { 
            foreignKey: 'user_id', 
            as: 'User' 
        });
        
        // One order has many items
        Order.hasMany(models.OrderItem, { 
            foreignKey: 'order_id', 
            as: 'OrderItems' 
        });
    };

    module.exports = Order;