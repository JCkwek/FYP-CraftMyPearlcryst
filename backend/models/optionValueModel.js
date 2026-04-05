const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const OptionValue = sequelize.define('OptionValue', {
    value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customization_options',
            key: 'option_id'
        }
    },
    value_label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visual_value: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    price_modifier: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    is_active: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'option_values',
    timestamps: false
});

// Association logic
OptionValue.associate = (models) => {
    // Each value belongs to a specific customization category (e.g., 'Rose Pink' belongs to 'Pearl Color')
    OptionValue.belongsTo(models.CustomizationOption, {
        foreignKey: 'option_id',
        as: 'ParentOption'
    });
};

module.exports = OptionValue;