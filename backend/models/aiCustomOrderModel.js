const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AiCustomOrder = sequelize.define('AiCustomOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    result_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'ai_generated_results',
            key: 'result_id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'quoted', 'declined', 'ordered'),
        defaultValue: 'pending'
    },
    admin_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    admin_note: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ai_custom_orders',
    timestamps: false 
});

AiCustomOrder.associate = (models) => {
    AiCustomOrder.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // Links to the specific AI result containing image, prompt, and selections
    AiCustomOrder.belongsTo(models.AiGeneratedResult, {
        foreignKey: 'result_id',
        as: 'aiResult'
    });
};

module.exports = AiCustomOrder;