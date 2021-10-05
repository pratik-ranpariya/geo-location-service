const BusinessRouter = require('express').Router();
const validate = require('./businessValidator')
const actions = require('./businessAction')


BusinessRouter.route('/add')
    .post([validate.addbusiness, validate.verifyAccess], (req, res, next) => {
        actions.addbusiness(req, res, next)
    });
BusinessRouter.route('/business_activate/:token')
    .get([], (req, res, next) => {
        actions.activatelink(req, res, next)
    });
BusinessRouter.route('/business_activate/:token')
    .post([], (req, res, next) => {
        actions.activatebusiness(req, res, next)
    });
BusinessRouter.route('/business_activate_link')
    .post([validate.verifyAccess], (req, res, next) => {
        actions.activatebusinesslink(req, res, next)
    });
BusinessRouter.route('/update')
    .put([validate.validateupdate, validate.verifyAccess], (req, res, next) => {
        actions.updatebusiness(req, res, next)
    });
BusinessRouter.route('/list')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.businesslist(req, res, next)
    });
BusinessRouter.route('/search')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.searchbusiness(req, res, next)
    });
BusinessRouter.route('/detail')
    .get([], (req, res, next) => {
        actions.businessdetail(req, res, next)
    });
BusinessRouter.route('/list/save')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.listsave(req, res, next)
    });
BusinessRouter.route('/list/visited')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.listvisited(req, res, next)
    });
BusinessRouter.route('/list/wanttogo')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.listwanttogo(req, res, next)
    });
BusinessRouter.route('/nearby')//filter isDeleted:false
    .get([], (req, res, next) => {
        actions.nearby(req, res, next)
    });
BusinessRouter.route('/latlong')
    .post([], (req, res, next) => {
        actions.latlong(req, res, next)
    });
BusinessRouter.route('/Approval')
    .get([], (req, res, next) => {
        actions.approvebusiness(req, res, next)
    });
BusinessRouter.route('/Approval')
    .post([], (req, res, next) => {
        actions.approvebusinessreq(req, res, next)
    });
// BusinessRouter.route('/add/suggestion')
//     .post([], (req, res, next) => {
//         actions.addSuggestion(req, res, next)
//     });
// BusinessRouter.route('/list/suggestion')
//     .get([], (req, res, next) => {
//         actions.listSuggestion(req, res, next)
//     });
BusinessRouter.route('/test')
    .get([], (req, res, next) => {
        res.json({ msg: "Test works" })
    });
BusinessRouter.route('/business_activate_test/:id').get([], (req, res) => {
    res.redirect('bleApp://ClaimBusiness')
})
// app.get('/business/business_activate/:id',(req,res)=>res.redirect('bleApp://Setting'))
// Approvalapprovetest
module.exports = BusinessRouter;