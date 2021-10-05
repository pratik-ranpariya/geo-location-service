
const customerRouter = require('../customer/customerRouter')
const businessRouter = require('../business/businessRouter')
const chatRouter = require('../chat/chatRouter')
const adminRouter =require('../admin/adminRouter')
const http = require('http');


module.exports = function (app) {
    app.use('/user', customerRouter)
    app.use('/business', businessRouter)
    app.use('/chat', chatRouter)
    app.use('/admin',adminRouter)
   
}