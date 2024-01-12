const conn = require("../connect")
const { DataTypes } = require('sequelize');

const BillSaleModel = conn.define('billSale', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    memberId: {
        type: DataTypes.BIGINT,
    },
    paydate: {
        type: DataTypes.DATE,
    },
    pricetotal: {
        type: DataTypes.BIGINT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },


})

// BillSaleModel.sync({ alter: true })


module.exports = BillSaleModel;