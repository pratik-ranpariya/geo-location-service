const adminDao = require('./adminDao')
const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const custmerDao = require('../customer/customerDao')
const jwt = require('jsonwebtoken')
const businessDao = require('../business/businessDao');
async function validateadd(req, res, next) {
    if (req.body.name) {
        var name = req.body.name.trim()

        if (name) {
            let query = { name: name }
            await adminDao.find(query).then((result) => {
                if (!result || result.length == 0) {
                    next()
                } else {
                    return res.json({ code: code.badRequest, message: msg.catalreadyadded });
                }
            }).catch()
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidBody })
        }
    }
    else {
        return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}
async function verifyAccess(req, res, next) {
    let token = req.headers['authorization']
    await jwt.verify(token, process.env.ADMIN_SECRET, (err) => {
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
                    console.log("verifyToken -> data", data.accountType)
                    if (data.accountType == accountType.SUPERADMIN) {
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
async function addbusiness(req, res, next) {
    let busienss = req.body.business
    var uniqueBusiness = []

    busienss.map(async (element, index) => {

        element.isDeleted = false;
        if (element.name && element.email && element.category && element.description
            && element.contactNo && element.address
            && element.website) {
            var name = element.name.trim(),
                email = element.email.trim()
            if (name && email) {
                let query = { email: email, status: status.active,isDeleted:false}
                if (await businessDao.findone(query)) {
                    return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered +" " + email });
                }
                else {
                    if (util.validateEmail(email)) {
                        uniqueBusiness.push(element)
                    } else {
                  
                        return res.json({ code: code.badRequest, message: msg.invalidEmail, data: element.email })
                    }
                }
                if ((index + 1) == busienss.length) {
                    req.body.uniquebusiness = uniqueBusiness;
                    next()
                }
            }
            else {
                return res.json({ code: code.badRequest, message: msg.invalidBody })
            }

        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidBody })
        }

    })

}
module.exports = {
    validateadd,
    verifyAccess,
    addbusiness
}