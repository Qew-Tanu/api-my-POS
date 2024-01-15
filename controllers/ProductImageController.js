const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const service = require('./Service');
const ProductImageModel = require('../models/ProductImageModel');
const fileUpload = require('express-fileupload');
const path = require('node:path');
const fs = require('fs');
const multer = require('multer');
// const firebaseConfig = require("../controllers/firebase-config")

// import { initializeApp } from "firebase/app";
// // const initializeApp = require('firebase/app')
// const getStorage = require('firebase/storage')
// const ref = require('firebase/storage')
// const getDownloadURL = require('firebase/storage')
// const uploadBytesResumable = require('firebase/storage')

// console.log(firebaseConfig);


// initializeApp(firebaseConfig)


// const storage = getStorage()

// const upload = multer({ storage: multer.memoryStorage() })


// app.post("/testpost", upload.single("filename"), async (req, res) => {

//     try {
//         const dateTime = giveCurrentDateTime();

//         const storageRef = ref(storage, `image/${req.file.originalname + "       " + dateTime}`);

//         // Create file metadata including the content type
//         const metadata = {
//             contentType: req.file.mimetype,
//         };

//         // Upload the file in the bucket storage
//         const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
//         //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

//         // Grab the public url
//         const downloadURL = await getDownloadURL(snapshot.ref);

//         console.log('File successfully uploaded.');
//         return res.send({
//             message: 'file uploaded to firebase storage',
//             name: req.file.originalname,
//             type: req.file.mimetype,
//             downloadURL: downloadURL
//         })
//     } catch (error) {
//         return res.status(400).send(error.message)
//     }
// });






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
        await ProductImageModel.findAll({
            where: {
                productId: req.body.productId
            }
        }).then(async (res) => {
            if (res.length === 0) {
                await ProductImageModel.create({
                    isMain: true,
                    imageName: req.body.productImageName,
                    productId: req.body.productId
                })
            } else {
                await ProductImageModel.create({
                    isMain: false,
                    imageName: req.body.productImageName,
                    productId: req.body.productId
                })
            }
        })
        res.send({ message: "success" })


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

