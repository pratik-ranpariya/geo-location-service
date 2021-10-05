const adminRouter = require('express').Router();
const validate = require('./adminValidator')
const actions = require('./adminAction')

// adminRouter.route('/login')
//     .post([validate.validateSignUp], (req, res, next) => {
//         actions.signup(req, res, next)
//     });
actions.createadmin()
adminRouter.route('/add/business')
    .post([validate.addbusiness, validate.verifyAccess], (req, res, next) => {
        actions.addbusiness(req, res, next)
    });
adminRouter.route('/add/category')
    .post([validate.verifyAccess, validate.validateadd], (req, res, next) => {
        actions.addcategory(req, res, next)
    });
adminRouter.route('/list/category')
    .get([], (req, res, next) => {
        actions.listcategory(req, res, next)
    });
adminRouter.route('/update/category')
    .put([validate.verifyAccess], (req, res, next) => {
        actions.updatecategory(req, res, next)
    });
adminRouter.route('/delete/category')
    .delete([validate.verifyAccess], (req, res, next) => {
        actions.deletecategory(req, res, next)
    });
adminRouter.route('/list/user')
    .get([], (req, res, next) => {
        actions.listuser(req, res, next)
    });
adminRouter.route('/list/business')
    .get([], (req, res, next) => {
        actions.listbusiness(req, res, next)
    });

adminRouter.route('/remove/user')//soft delete here
    .delete([validate.verifyAccess], (req, res, next) => {
        actions.removeuser(req, res, next)
    });
adminRouter.route('/remove/business')//soft delete here
    .delete([validate.verifyAccess], (req, res, next) => {
        actions.removebusiness(req, res, next)
    });
adminRouter.route('/verifyToken')
    .get([], (req, res, next) => {
        actions.verifyToken(req, res, next)
    });
adminRouter.route('/businessreq')
    .put([validate.verifyAccess], (req, res, next) => {
        actions.businessreq(req, res, next)
    });
adminRouter.route('/list/suggestion')
    .get([], (req, res, next) => {
        actions.listSuggestion(req, res, next)
    });
adminRouter.route('/list/reportedUsers')
    .get([], (req, res, next) => {
        actions.listreportedUsers(req, res, next)
    });
module.exports = adminRouter;