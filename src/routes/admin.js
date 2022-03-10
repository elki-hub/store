const express = require('express')
const router = express.Router()
const ProductRouter = require('./product')

router.get('/', (req, res) => {
    res.render('admin')
})

router.use('/product', ProductRouter)

module.exports = router