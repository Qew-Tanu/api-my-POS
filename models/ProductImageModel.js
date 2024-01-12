const conn = require("../connect")

const { DataTypes } = require('sequelize');

const ProductImageModel = conn.define('productImages', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.BIGINT,
    },
    imageName: {
        type: DataTypes.STRING(255),
    },
    isMain: {
        type: DataTypes.BOOLEAN,
    },
})
// ProductImageModel.sync({ alter: true })

module.exports = ProductImageModel;