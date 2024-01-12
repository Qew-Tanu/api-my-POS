const conn = require("../connect")


const { DataTypes } = require('sequelize');


const MemberModel = conn.define('members', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    packageId: {
        type: DataTypes.BIGINT,
    },
    name: {
        type: DataTypes.STRING(255),
    },
    username: {
        type: DataTypes.STRING(255),
    },
    password: {
        type: DataTypes.STRING(255),
    },
    phone: {
        type: DataTypes.STRING(255),
    },

})

MemberModel.sync({ alter: true })


module.exports = MemberModel;