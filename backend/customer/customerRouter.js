const customerRouter = require('express').Router();
const validate = require('./customerValidator')
const actions = require('./customerAction')
const service = require('./customerService');
const customerDao = require('./customerDao');
customerRouter.route('/signUp')
    .post([validate.validateSignUp], (req, res, next) => {
        actions.signup(req, res, next)
    });

customerRouter.route('/login')
    .post([validate.validateLogin], (req, res) => {
        actions.login(req, res)
    });

customerRouter.route('/add/save')
    .post([validate.verifyToken], (req, res) => {
        actions.addtosave(req, res)
    });
customerRouter.route('/remove/save')
    .post([validate.verifyToken], (req, res) => {
        actions.removesave(req, res)
    });
customerRouter.route('/add/wanttogo')
    .post([validate.verifyToken], (req, res) => {
        actions.addtowanttogo(req, res)
    });
customerRouter.route('/remove/wanttogo')
    .post([validate.verifyToken], (req, res) => {
        actions.removewanttogo(req, res)
    });


customerRouter.route('/add/visited')
    .post([validate.verifyToken], (req, res) => {
        actions.addtovisited(req, res)
    });
customerRouter.route('/remove/visited')
    .post([validate.verifyToken], (req, res) => {
        actions.removevisited(req, res)
    });


customerRouter.route('/updateProfile')
    .put([validate.validateProfile, validate.verifyToken], (req, res) => {
        actions.updateProfile(req, res)
    })

customerRouter.route('/changePassword')
    .put([validate.validateChangePassword, validate.verifyToken], (req, res) => {
        actions.changePassword(req, res)
    });

customerRouter.route('/forgotPassword')
    .post([], (req, res) => {
        actions.forgotPassword(req, res)
    })
customerRouter.route('/reset/:token')
    .get([], (req, res) => {
        actions.getresetpassword(req, res)
    })
customerRouter.route('/reset/:token')
    .post([], (req, res) => {
        actions.resetpassword(req, res)
    })
customerRouter.route('/list/visited')
    .get([validate.verifyToken], (req, res) => {
        actions.listvisited(req, res)
    })
customerRouter.route('/list/wanttogo')
    .get([validate.verifyToken], (req, res) => {
        actions.listwanttogo(req, res)
    })
customerRouter.route('/list/saved')
    .get([validate.verifyToken], (req, res) => {
        actions.listsaved(req, res)
    })

customerRouter.route('/list/users')
    .get([validate.validateUser], (req, res) => {
        console.log("req.body.filter", req.body.filter)
        actions.listusers(req, res)
    })
customerRouter.route('/userdetail')
    .get([validate.verifyToken], (req, res) => {
        actions.userdetail(req, res)
    })
customerRouter.route('/uploadPhoto')
    .post([], (req, res) => {
        service.uploadPhoto(req, res)
    })
customerRouter.route('/gmail/socialLogin')
    .post([validate.validateSocialLogin], (req, res) => {
        actions.socialloginGmail(req, res)
    })
customerRouter.route('/facebook/socialLogin')
    .post([validate.validateSocialLoginFace], (req, res) => {
        actions.socialloginFacebook(req, res)
    })
customerRouter.route('/linkedin/socialLogin')
    .post([validate.validateSocialLoginLinkedin], (req, res) => {
        actions.socialloginLinkedin(req, res)
    })

customerRouter.route('/blockuser')
    .post([], (req, res) => {
        service.blockUser(req, res)
    })
customerRouter.route('/blockuser/list')
    .get([], (req, res) => {
        service.blockuserlist(req, res)
    })
customerRouter.route('/reportuser')
    .post([], (req, res) => {
        service.reportUser(req, res)
    })
customerRouter.route('/deleteacc')
    .put([], (req, res) => {
        service.deleteAcc(req, res)
    })
customerRouter.route('/add/suggestion')
    .post([], (req, res, next) => {
        actions.addSuggestion(req, res, next)
    });
module.exports = customerRouter;