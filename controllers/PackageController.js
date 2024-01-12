const express = require('express')
const app = express()
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')



app.get('/package/list', async (req, res) => {
    try {
        const results = await PackageModel.findAll({
            order: ['price']
        })
        res.send({ results: results })
    } catch (error) {
        res.send({ message: error.message });
    }
})

app.post('/package/memberRegister', async (req, res) => {
    try {
        const usernameCheck = await MemberModel.findAll({
            where: {
                username: req.body.username
            }
        })
        if (usernameCheck.length > 0) {
            // console.log("hello");
            res.status(401).send({ message: 'This username is already used' });
        } else {
            const results = await MemberModel.create(req.body);
            res.send({ message: 'success', results: results });
        }
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error });
    }
})



module.exports = app;