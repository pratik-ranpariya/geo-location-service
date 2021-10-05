const service = require('./adminService')


// function login(req, res,next) {
//     service.login(req, res,next)
// }
function addbusiness(req, res, next) {
    service.addbusiness(req, res, next)
}
function addcategory(req, res, next) {
    service.addcategory(req, res, next)
}
function listcategory(req, res, next) {
    service.listcategory(req, res, next)
}

function updatecategory(req, res, next) {
    service.updatecategory(req, res, next)
}

function deletecategory(req, res, next) {
    service.deletecategory(req, res, next)
}
function listuser(req, res, next) {
    service.listuser(req, res, next)
}
function removeuser(req, res, next) {
    service.removeuser(req, res, next)
}
function createadmin(req, res, next) {
    service.createadmin(req, res, next)
}
function verifyToken(req, res, next) {
    service.verifyToken(req, res, next)
}
function listbusiness(req, res, next) {
    service.listbusiness(req, res, next)
}
function businessreq(req, res, next) {
    service.businessreq(req, res, next)
}
function removebusiness(req, res, next) {

    service.removebusiness(req, res, next)
}
function listSuggestion(req, res, next) {
    service.listSuggestion(req, res, next)
}
function listreportedUsers(req, res, next) {
    service.listreportedUsers(req, res, next)
}
module.exports = {
    // login,
    addcategory,
    listcategory,
    updatecategory,
    deletecategory,
    listuser,
    removeuser,
    createadmin,
    listbusiness,
    businessreq,
    verifyToken,
    addbusiness,
    removebusiness,
    listSuggestion,
    listreportedUsers
}