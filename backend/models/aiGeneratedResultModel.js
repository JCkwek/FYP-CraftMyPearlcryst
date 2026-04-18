const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AIGeneratedResult = sequelize.define('AIGeneratedResult', {
    result_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,   // nullable so generation works without a logged-in user
        references: { model: 'users', key: 'user_id' }
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_prompt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    selections: {
        type: DataTypes.JSON, // Stores the array of component IDs chosen
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: 'ai_generated_results',
    timestamps: true // Useful for tracking when the generation happened
});

AIGeneratedResult.associate = (models) => {
    AIGeneratedResult.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'User' 
    });
};

module.exports = AIGeneratedResult;