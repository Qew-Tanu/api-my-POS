const conn = require("../connect")
const { DataTypes } = require('sequelize');

const ProductModel = conn.define('products', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    memberId: {
        type: DataTypes.BIGINT,
    },
    barcode: {
        type: DataTypes.STRING(255),
    },
    name: {
        type: DataTypes.STRING(255),
    },
    cost: {
        type: DataTypes.BIGINT,
    },
    price: {
        type: DataTypes.BIGINT,
    },
    detail: {
        type: DataTypes.STRING(255),
    },

})

// ProductModel.sync({ alter: true })


module.exports = ProductModel;