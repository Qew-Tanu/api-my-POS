const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const ProductModel = require('../models/ProductModel')
const service = require('./Service');
const ProductImageModel = require('../models/ProductImageModel');


app.post('/product/insert', service.isLogin, async (req, res) => {
    try {
        const payload = jwt.decode(service.getToken(req))
        let datainsert = { ...req.body, memberId: payload.id }
        const result = await ProductModel.create(datainsert)
        res.send({ results: result, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/product/list', service.isLogin, async (req, res) => {
    try {
        const payload = jwt.decode(service.getToken(req))
        const products = await ProductModel.findAll({
            order: [['id', 'DESC']],
            where: {
                memberId: payload.id
            }
        })
        res.send({ results: products, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.delete('/product/delete/:id', service.isLogin, async (req, res) => {
    try {
        const results = await ProductModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})

app.post('/product/update', service.isLogin, async (req, res) => {
    try {
        const payload = jwt.decode(service.getToken(req))
        let datainsert = { ...req.body, memberId: payload.id }
        const result = await ProductModel.update(datainsert, {
            where: {
                id: datainsert.id
            }
        })
        res.send({ results: result, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


app.get('/product/listforsale', service.isLogin, async (req, res) => {
    const ProductImageModel = require('../models/ProductImageModel');
    ProductModel.hasMany(ProductImageModel)
    try {
        const payload = jwt.decode(service.getToken(req))
        const products = await ProductModel.findAll({
            order: [['id', 'DESC']],
            where: {
                memberId: payload.id
            },
            include: {
                model: ProductImageModel,
                where: {
                    isMain: true
                }
            }
        })

        res.send({ results: products, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/product/listforsale222', service.isLogin, async (req, res) => {
    try {
        const payload = jwt.decode(service.getToken(req))
        const products = await ProductModel.findAll({
            order: [['id', 'DESC']],
            where: {
                memberId: payload.id
            },
        })
        let testttt = []
        for (const item of products) {
            // console.log(item.id);
            const hello = await ProductImageModel.findAll({
                where: {
                    productId: item.id
                }
            })
            // console.log(hello);
            testttt.push({ ...item.dataValues, image: hello })
        }

        // console.log(testttt);

        res.send({ results: testttt, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


module.exports = app;