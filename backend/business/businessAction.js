const service = require('./businessService')

function addbusiness(req, res,next) {
    service.addbusiness(req, res,next)
}
function activatelink(req, res,next) {
    service.activatelink(req, res,next)

}
function activatebusiness(req, res,next) {
    service.activatebusiness(req, res,next)
}

function activatebusinesslink(req, res,next) {
    service.activatebusinesslink(req, res,next)
}
function updatebusiness(req, res,next) {
    service.updatebusiness(req, res,next)
}
function businesslist(req, res,next) {
    service.businesslist(req, res,next)
}
function businessdetail(req, res,next) {
    service.businessdetail(req, res,next)
}
function listsave(req, res,next) {
    service.listsave(req, res,next)
}
function listvisited(req, res,next) {
    service.listvisited(req, res,next)
}
function listwanttogo(req, res,next) {
    service.listwanttogo(req, res,next)
}
function nearby(req, res,next) {
    service.nearby(req, res,next)
}
function latlong(req, res,next) {
    service.latlong(req, res,next)
}
function approvebusiness(req, res,next) {
    service.Approvebusiness(req, res,next)
}
function approvebusinessreq(req, res,next) {
    service.approvebusinessreq(req, res,next)
}
function searchbusiness(req, res,next) {
    service.searchbusiness(req, res,next)
}

// function addSuggestion(req, res,next) {
//     service.addSuggestion(req, res,next)
// }
// function listSuggestion(req, res,next) {
//     service.listSuggestion(req, res,next)
// }
module.exports = {
    addbusiness,
    activatelink,
    activatebusiness,
    activatebusinesslink,
    updatebusiness,
    businesslist,
    businessdetail,
    listsave,
    listvisited,
    listwanttogo,
    nearby,
    latlong,
    approvebusiness,
    approvebusinessreq,
    searchbusiness
    // addSuggestion,
    // listSuggestion
}