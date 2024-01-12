const express = require('express')
const app = express()
const port = process.env.PORT || 8888
const cors = require('cors')

const bodyParser = require('body-parser')

app.use(cors())
// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
//     res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,x-access-token,x-refresg-token,_id,Authorization")
//     res.header("Access-Control-Expose-Headers", "x-access-token", "x-refresg-token")
//     next()
// })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

app.use(require('./controllers/PackageController'))
app.use(require('./controllers/MemberController'))
app.use(require('./controllers/ProductContrller'))
app.use(require('./controllers/ProductImageController'))
app.use(require('./controllers/BillSaleController'))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

