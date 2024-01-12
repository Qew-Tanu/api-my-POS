const conn = require("../connect")
const { DataTypes } = require('sequelize');

const BillSaleDetailModel = conn.define('billsaledetail', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    billSaleId: {
        type: DataTypes.BIGINT,
    },
    productId: {
        type: DataTypes.BIGINT,
    },
    qty: {
        type: DataTypes.BIGINT,
    },
    price: {
        type: DataTypes.BIGINT,
    },
    memberId: {
        type: DataTypes.BIGINT,
    },


})

BillSaleDetailModel.sync({ alter: true })


module.exports = BillSaleDetailModel;