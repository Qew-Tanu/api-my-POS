module.exports = {
    getToken: (req) => {
        return req.headers.authorization.replace('Bearer ', '')
    },
    isLogin: (req, res, next) => {
        require("dotenv").config()
        const jwt = require('jsonwebtoken');

        if (req.headers.authorization != null) {
            const token = req.headers.authorization.replace('Bearer ', '');
            const secret = process.env.secret;
            try {
                const verify = jwt.verify(token, secret);
                if (verify != null) {
                    next()
                }
            } catch (error) {
                res.status(401).send('authorize fail 2222')
            }

        } else {
            res.status(401).send('authorize fail')
        }
    },
    getMemberId: (req) => {
        const token = req.headers.authorization.replace('Bearer ', '')
        const jwt = require('jsonwebtoken');
        const payload = jwt.decode(token)
        return payload.id
    }
}
