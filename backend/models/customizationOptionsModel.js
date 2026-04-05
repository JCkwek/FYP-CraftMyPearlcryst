const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CustomizationOption = sequelize.define('CustomizationOption', {
    option_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'product_id'
        }
    },
    option_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    option_type: {
        type: DataTypes.ENUM('list', 'range'),
        defaultValue: 'list'
    },
    is_active: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'customization_options',
    timestamps: false
});

// Association logic
CustomizationOption.associate = (models) => {
    // Each option belongs to one product
    CustomizationOption.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'Product'
    });

    // One option can have many specific values (e.g., Pearl Color -> White, Pink, Lavender)
    CustomizationOption.hasMany(models.OptionValue, {
        foreignKey: 'option_id',
        as: 'values'
    });
};

module.exports = CustomizationOption;