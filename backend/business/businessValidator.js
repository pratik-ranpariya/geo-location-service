const businessDao = require('./businessDao')
const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const status = require('../constants').status;
const role = require('../constants').roles;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const jwt = require('jsonwebtoken')
const custmerDao = require('../customer/customerDao')
const accountType = require('../constants').accountType;
async function addbusiness(req, res, next) {
    if (req.body.name && req.body.email  && req.body.category  && req.body.description 
        && req.body.contactNo && req.body.address
        && req.body.website  && req.body.availablity ) {
        var name = req.body.name.trim(),
            email = req.body.email.trim()
        if (name && email) {
            let query = { email: email, status: status.active }
            if (await businessDao.findone(query)) {
                return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered });
            }
            else {
                if (util.validateEmail(email)) {
                    next()
                } else {
                    return res.json({ code: code.badRequest, message: msg.invalidEmailPass })
                }
            }
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidBody })
        }
    }
    else {
        return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}
function validateupdate(req, res, next) {
    let { email } = req.body;
    if (email) {
        res.json({ code: code.badRequest, message: msg.invalidBody })
    }
    else {
        next()
    }
}

async function verifyAccess(req, res, next) {
    let token = req.headers['authorization']
    await jwt.verify(token, process.env.USER_SECRET, (err) => {
        if (err) {
            return res.json({ code: code.unAuthorized, message: msg.invalidToken })
        }
        else {
            let obj = util.decodeToken(token)
            let query = { _id: obj.id }
            custmerDao.finduser(query).then((data) => {
                if (!data) {
                    return res.json({ code: code.unAuthorized, message: msg.invalidToken })
                } else {

                    if (data.accountType == accountType.BUSSINESSUSER) {
                        // req.body.createdBy = data._id;
                        next();
                    } else {
                        return res.json({ code: code.unAuthorized, message: msg.businessrite })
                    }
                }
            }).catch((err) => {
                return res.json({ code: code.internalError, message: msg.internalServerError }) //msg.internalServerError })
            })
        }
    })
}
async function verifyToken(req, res, next) {
    let token = req.headers['Authorization']
    await jwt.verify(token, process.env.ADMIN_SECRET, (err) => {
        if (err) {
            return res.json({ code: code.unAuthorized, message: msg.invalidToken })
        }
        else {
            let obj = util.decodeToken(token)
            console.log("verifyToken -> obj", obj)
            let query = { _id: obj.id }
            custmerDao.finduser(query).then((data) => {
                console.log("verifyToken -> data", data)
                if (!data) {
                    return res.json({ code: code.unAuthorized, message: msg.invalidToken })
                } else {

                    next();

                }
            }).catch((err) => {
                return res.json({ code: code.internalError, message: msg.internalServerError }) //msg.internalServerError })
            })
        }
    })
}
async function verifyApproveAccess(req, res, next) {
    let token = req.headers['authorization']
    console.log("verifyApproveAccess -> token", token)
    await jwt.verify(token, process.env.ADMIN_SECRET, (err) => {
        if (err) {
            console.log("verifyApproveAccess -> err", err)
            return res.json({ code: code.unAuthorized, message: msg.invalidToken })
        }
        else {
            let obj = util.decodeToken(token)
            let query = { _id: obj.id }
            custmerDao.finduser(query).then((data) => {
                if (!data) {
                    return res.json({ code: code.unAuthorized, message: msg.invalidToken })
                } else {
                    console.log("verifyToken -> data", data.accountType)
                    if (data.accountType == accountType.SUPERADMIN) {
                        // req.body.createdBy = data._id;
                        next();
                    } else {
                        return res.json({ code: code.unAuthorized, message: msg.businessapprovalrite })
                    }
                }
            }).catch((err) => {
                return res.json({ code: code.internalError, message: msg.internalServerError }) //msg.internalServerError })
            })
        }
    })
}
module.exports = {
    validateupdate,
    addbusiness,
    verifyToken,
    verifyAccess,
    verifyApproveAccess
}