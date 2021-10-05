const customerDao = require('./customerDao')
const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const status = require('../constants').status;
const role = require('../constants').roles;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const jwt = require('jsonwebtoken');
const { accountType } = require('../constants');
const axios = require('axios');
async function validateSignUp(req, res, next) {
    if (req.body.name && req.body.password && req.body.email && req.body.accountType) {
        var name = req.body.name.trim(),
            email = req.body.email.trim(),
            password = req.body.password.trim();

        if (name && email && password) {
            let query = { email: email }
            if (await customerDao.finduser(query)) {
                return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered });
            }
            else {
                if (util.validateEmail(email)
                    && util.validatePassword(password)) {
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
async function validateLogin(req, res, next) {
    if (req.body.email && req.body.password) {
        next()
    }
    else {
        return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}
function validateChangePassword(req, res, next) {
    if (req.body.oldPassword && req.body.newPassword) {
        let oldPass = req.body.oldPassword.trim(),
            newPass = req.body.newPassword.trim()
        if (oldPass && newPass) {
            next()
        }
        else {
            res.json({ code: code.badRequest, message: msg.invalidBody })
        }
    }
    else {
        res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}

async function verifyToken(req, res, next) {
    let token = req.headers['authorization']
    await jwt.verify(token, process.env.USER_SECRET, (err) => {
        if (err) {
            return res.json({ code: code.unAuthorized, message: msg.invalidToken })
        }
        else {
            let obj = util.decodeToken(token)
            let query = { _id: obj.id }
            customerDao.finduser(query).then((data) => {
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

function validateProfile(req, res, next) {
    let { email } = req.body;
    if (email) {
        res.json({ code: code.badRequest, message: msg.invalidBody })
    }
    else {
        next()
    }
}
async function validateUser(req, res, next) {
    let token = req.headers['authorization']
    await jwt.verify(token, process.env.USER_SECRET, (err) => {
        if (err) {
            return res.json({ code: code.unAuthorized, message: msg.invalidToken })
        }
        else {
            let obj = util.decodeToken(token)
            let query = { _id: obj.id }
            customerDao.finduser(query).then((data) => {
                if (!data) {
                    return res.json({ code: code.unAuthorized, message: msg.invalidToken })
                } else {
                    if (data.accountType == accountType.BUSSINESSUSER) {
                        req.body.filter = accountType.CUSTOMER
                        next()
                    } else {
                        req.body.filter = accountType.BUSSINESSUSER
                        next()
                    }
                }
            }).catch((err) => {
                return res.json({ code: code.internalError, message: msg.internalServerError }) //msg.internalServerError })
            })
        }
    })
}
async function validateSocialLogin(req, res, next) {
    if (req.body.name && req.body.id && req.body.email && req.body.idToken) {
        let name = req.body.name.trim(),
            socialId = req.body.id.trim(),
            email = req.body.email.trim()
        idToken = req.body.idToken.trim()

        if (name && socialId && email && idToken) {
            // gmail account idtoken varification function 
            await client.verifyIdToken({
                idToken: idToken
            }).then((result) => {
                console.log("validateSocialLogin -> result", result)
                const valid = (result.payload.email == email && result.payload.sub == socialId && result.payload.name == name)
                if (valid == true) {
                    next()
                } else {
                    res.json({ code: code.badRequest, message: msg.invalidBody });
                }
            }).catch((err) => {
                return res.json({ code: code.badRequest, message: msg.invalidtoken })

            })
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidBody })
        }
    }
    else {
        return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}
async function validateSocialLoginFace(req, res, next) {
    if (req.body.accessToken && req.body.id && req.body.email && req.body.name) {
        let name = req.body.name.trim(),
            socialId = req.body.id.trim(),
            email = req.body.email.trim()
        idToken = req.body.accessToken.trim()

        if (name && socialId && email && idToken) {
            await axios({
                url: 'https://graph.facebook.com/me',
                method: 'get',
                params: {
                    fields: ['id', 'email', 'first_name', 'last_name'].join(','),
                    access_token: idToken,
                },
            }).then((result) => {
                console.log("validateSocialLoginFace -> result", result.data)
                const valid = (result.data.id = socialId && result.data.email == email)
                if (valid == true) {
                    next()
                } else {
                    res.json({ code: code.badRequest, message: msg.invalidtoken });
                }
            }).catch((err) => {
                return res.json({ code: code.badRequest, message: msg.invalidtoken })
            });

        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidBody })
        }
    }
    else {
        return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
}
async function validateSocialLoginLinkedin(req, res, next) {
    if (req.body.accessToken) {
        let token = req.body.accessToken.trim();
        console.log("validateSocialLoginLinkedin -> token", token)

        await axios({
            url: 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
            method: 'get',
            headers: { "Authorization": `Bearer ${token}` }
        }).then(async (result) => {
            // console.log("validateSocialLoginLinkedin -> result",)
            var imageUrl = result.data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier
            if (result.status == 401) {
                return res.json({ code: code.badRequest, message: msg.invalidtoken })
            }
            await axios({
                url: "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                method: 'get',
                headers: { "Authorization": `Bearer ${token}` }
            }).then(async (resultmail) => {
                let Obj = {
                    socialId: result.data.id,
                    firstName: result.data.firstName.localized['en_US'],
                    lastName: result.data.lastName.localized['en_US'],
                    email: resultmail.data.elements[0]['handle~'].emailAddress,
                    imageUrl: (imageUrl) ? imageUrl : ''
                }
                console.log("validateSocialLoginLinkedin -> Obj", Obj)
                req.body = Obj;
                await next()
            })
        }).catch((err) => {
            console.log("validateSocialLoginLinkedin -> err", err)
            return res.json({ code: code.badRequest, message: msg.invalidtoken })
        });
    }
}

module.exports = {
    validateSignUp,
    validateLogin,
    validateChangePassword,
    verifyToken,
    validateProfile,
    validateUser,
    validateSocialLogin,
    validateSocialLoginFace,
    validateSocialLoginLinkedin,
}