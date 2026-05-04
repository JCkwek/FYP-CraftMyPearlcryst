const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AiJewelryComponent = sequelize.define('AiJewelryComponent', {
    component_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    step: {
        type: DataTypes.INTEGER, // 1 to 7
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, // e.g., 'base_type', 'material', 'pendant'
        allowNull: false
    },
    requirement: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'ai_jewelry_components', key: 'component_id' },
        comment: "Used to handle conditional logic (e.g., pendants only for necklaces)"
    },
    prompt_fragment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "The specific text sent to Hugging Face for this choice"
    },
    image_preview: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price_impact: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
}, {
    tableName: 'ai_jewelry_components',
    timestamps: false
});

AiJewelryComponent.associate = (models) => {
    // Self-reference for hierarchical logic
    AiJewelryComponent.hasMany(models.AiJewelryComponent, { 
        foreignKey: 'parent_id', 
        as: 'SubOptions' 
    });
    AiJewelryComponent.belongsTo(models.AiJewelryComponent, { 
        foreignKey: 'parent_id', 
        as: 'ParentOption' 
    });
};

module.exports = AiJewelryComponent;