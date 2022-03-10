const express = require('express')
const router = express.Router()
const AdminRouter = require('./admin')

router.get('/', async (req, res) => {
    res.render('index', )
})

router.use('/admin', AdminRouter)


module.exports = router