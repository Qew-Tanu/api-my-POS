const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const service = require('./Service');
const ProductImageModel = require('../models/ProductImageModel');
const fileUpload = require('express-fileupload');
const path = require('node:path');
const fs = require('fs')


app.use(fileUpload());


app.post('/productImage/insert', service.isLogin, async (req, res) => {
    try {
        // console.log(req);
        const myDate = new Date();
        const nameArray = [
            myDate.getFullYear(),
            myDate.getMonth() + 1,
            myDate.getDate(),
            myDate.getHours(),
            myDate.getMinutes(),
            myDate.getSeconds(),
            myDate.getMilliseconds(),
            parseInt(Math.random() * 100000)
        ]
        // console.log(newName);
        const productImage = req.files.productImage
        // console.log(path.extname(productImage.name));
        const newName = nameArray.join("-") + path.extname(productImage.name)
        const uploadPath = __dirname + '/../uploads/' + newName
        await productImage.mv(uploadPath, async (err) => {
            if (err) {
                throw new Error(err)
            }
            await ProductImageModel.findAll({
                where: {
                    productId: req.body.productId
                }
            }).then(async (res) => {
                if (res.length === 0) {
                    await ProductImageModel.create({
                        isMain: true,
                        imageName: newName,
                        productId: req.body.productId
                    })
                } else {
                    await ProductImageModel.create({
                        isMain: false,
                        imageName: newName,
                        productId: req.body.productId
                    })
                }
            })
            res.send({ message: "success" })
        })


    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error });
    }
})

app.get('/productImage/list/:productId', service.isLogin, async (req, res) => {
    try {
        const results = await ProductImageModel.findAll({
            where: {
                productId: req.params.productId
            },
            order: [['id', 'DESC']]
        })
        res.send({ results: results, message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.delete('/productImage/delete/:id', service.isLogin, async (req, res) => {
    try {
        const row = await ProductImageModel.findByPk(req.params.id)
        const imgPath = __dirname + '/../uploads/' + row.imageName
        // return res.send({ row: imgPath, message: "success" })
        await ProductImageModel.destroy({
            where: {
                id: req.params.id
            }
        })


        fs.unlink(imgPath, function (err) {
            if (err) throw err;
        })

        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})

app.get('/productImage/choosemainimage/:id/:productId', service.isLogin, async (req, res) => {
    try {
        await ProductImageModel.update({
            isMain: false
        }, {
            where: {
                productId: req.params.productId
            }
        }).then(async (res) => {
            await ProductImageModel.update({
                isMain: true
            }, {
                where: {
                    id: req.params.id
                }
            })

        })

        res.send({ message: "success" })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

module.exports = app;

