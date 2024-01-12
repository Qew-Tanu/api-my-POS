const express = require('express');
const MemberModel = require('../models/MemberModel');
const app = express()
const jwt = require('jsonwebtoken');
const service = require('./Service');
const PackageModel = require('../models/PackageModel');
require("dotenv").config()



app.post('/member/signin', async (req, res) => {
    try {
        // console.log("test");
        const member = await MemberModel.findAll({
            where: {
                username: req.body.username,
                password: req.body.password,
            }
        })
        if (member.length > 0) {
            let token = jwt.sign({ id: member[0].id }, process.env.secret)
            res.send({ message: "success", token: token, name: member[0].name })
        } else {
            res.status(401).send({ message: "Username or Password wrong" })
        }
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error });
    }
})

app.get('/member/info', service.isLogin, async (req, res) => {
    try {
        MemberModel.belongsTo(PackageModel)
        const payload = jwt.decode(service.getToken(req))
        const member = await MemberModel.findByPk(payload.id, {
            attributes: ['id', 'name', 'phone'],
            include: [
                {
                    model: PackageModel,
                    attributes: ['name']
                }
            ]
        })

        res.send({ result: member, message: "success" })
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error });
    }
})

app.put('/member/changeProfile', service.isLogin, async (req, res) => {
    try {
        const memberId = service.getMemberId(req)
        const result = await MemberModel.update(req.body, {
            where: {
                id: memberId
            }
        })


        res.send({ result: result, message: "success" })
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error });
    }
})

module.exports = app;