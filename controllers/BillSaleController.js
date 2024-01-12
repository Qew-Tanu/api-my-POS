const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const service = require('./Service');
const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');
const { Op } = require('sequelize');

require("dotenv").config()




app.get('/billsale/openBill', service.isLogin, async (req, res) => {
    try {
        const results = await BillSaleModel.findOrCreate({
            where: {
                memberId: service.getMemberId(req),
                status: true
            }
        })

        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.post('/billsale/sale', service.isLogin, async (req, res) => {
    try {
        const currentBill = await BillSaleModel.findOne({
            where: {
                memberId: service.getMemberId(req),
                status: true
            }
        })
        const payload = jwt.decode(service.getToken(req))

        const check = await BillSaleDetailModel.findOne({
            where: {
                productId: req.body.id,
                price: req.body.price,
                billSaleId: currentBill.id,
                memberId: payload.id,
            }
        })
        const datainsert = {
            productId: req.body.id,
            price: req.body.price,
            billSaleId: currentBill.id,
            memberId: payload.id,
        }
        if (check !== null) {
            datainsert.qty = parseInt(check.qty) + 1
            await BillSaleDetailModel.update(datainsert, {
                where: {
                    productId: req.body.id,
                    price: req.body.price,
                    billSaleId: currentBill.id,
                    memberId: payload.id,
                }
            })
        } else {
            datainsert.qty = 1
            await BillSaleDetailModel.create(datainsert)
        }

        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/billsale/detaillist', service.isLogin, async (req, res) => {
    try {
        const ProductModel = require('../models/ProductModel')
        BillSaleModel.hasMany(BillSaleDetailModel)
        BillSaleDetailModel.belongsTo(ProductModel)

        const currentBill = await BillSaleModel.findOne({

            where: {
                memberId: service.getMemberId(req),
                status: true
            },
            include: {
                model: BillSaleDetailModel,

                include: {
                    model: ProductModel,
                    attributes: ['name', 'barcode']
                }

            },
            order: [
                [BillSaleDetailModel, 'id', 'DESC']],
        })

        res.send({ results: currentBill, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.delete('/billsale/delete/:id', service.isLogin, async (req, res) => {
    try {
        const results = await BillSaleDetailModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.post('/billsale/plusminus', service.isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.update(req.body, {

            where: {
                id: req.body.id
            }
        })
        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})

app.post('/billsale/editsaledetail', service.isLogin, async (req, res) => {
    try {
        const payload = jwt.decode(service.getToken(req))

        const check = await BillSaleDetailModel.findOne({
            where: {
                productId: req.body.id,
                price: req.body.price,
                billSaleId: req.body.billeditid,
                memberId: payload.id,
            }
        })
        const datainsert = {
            productId: req.body.id,
            price: req.body.price,
            billSaleId: req.body.billeditid,
            memberId: payload.id,
        }
        if (check !== null) {
            datainsert.qty = parseInt(check.qty) + 1
            await BillSaleDetailModel.update(datainsert, {
                where: {
                    productId: req.body.id,
                    price: req.body.price,
                    billSaleId: req.body.billeditid,
                    memberId: payload.id,
                }
            })
        } else {
            datainsert.qty = 1
            await BillSaleDetailModel.create(datainsert)
        }

        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.post('/billsale/finishorder', service.isLogin, async (req, res) => {
    try {
        await BillSaleModel.update({
            status: false,
            paydate: new Date().toString(),
            pricetotal: req.body.pricetotal
        }, {
            where: {
                id: req.body.id,
                memberId: service.getMemberId(req),
            }
        })
        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.post('/billsale/saveorder', service.isLogin, async (req, res) => {
    try {
        await BillSaleModel.update({
            status: false,
            pricetotal: req.body.pricetotal,
        }, {
            where: {
                id: req.body.id,
                memberId: service.getMemberId(req),
            }
        })
        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/billsale/lastbill', service.isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel)
        const results = await BillSaleModel.findAll({
            where: {
                status: false,
            },
            order: [['id', 'DESC']],
            limit: 1,
            include: {
                model: BillSaleDetailModel
            }
        })
        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})

app.get('/billsale/savebill', service.isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel)
        const results = await BillSaleModel.findAll({
            where: {
                status: false,
                paydate: null
            },
            order: [
                ['updatedAt', 'DESC'],
                [BillSaleDetailModel, 'id', 'DESC']
            ],
            include: {
                model: BillSaleDetailModel
            }
        })
        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.post('/billsale/editbill', service.isLogin, async (req, res) => {
    try {
        const ProductModel = require('../models/ProductModel')
        BillSaleModel.hasMany(BillSaleDetailModel)
        BillSaleDetailModel.belongsTo(ProductModel)

        const results = await BillSaleModel.findAll({
            where: {
                id: req.body.id
            },
            include: {
                model: BillSaleDetailModel,

                include: {
                    model: ProductModel,
                    attributes: ['name', 'barcode']
                }

            },
            order: [
                [BillSaleDetailModel, 'id', 'DESC']],
        })

        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.delete('/billsale/billdelete/:id', service.isLogin, async (req, res) => {
    try {

        const results = await BillSaleModel.destroy({
            where: {
                id: req.params.id
            }
        })
        await BillSaleDetailModel.destroy({
            where: {
                billSaleId: req.params.id
            }
        })
        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/billsale/allpaybill', service.isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel)
        const results = await BillSaleModel.findAll({
            where: {
                status: false,
                paydate: {
                    [Op.not]: null
                }
            },
            order: [
                ['paydate', 'DESC'],
                [BillSaleDetailModel, 'id', 'DESC']
            ],
            include: {
                model: BillSaleDetailModel
            }
        })
        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

module.exports = app;