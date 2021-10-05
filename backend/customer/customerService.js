const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const role = require('../constants').roles;
const bcrypt = require('bcrypt');
const customerdao = require('./customerDao');
const businessdao = require('../business/businessDao');
const crypto = require('crypto');
const customer = require('../schema/user');
const { accountType } = require('../constants');
const env = require('dotenv').config()
ObjectId = require('mongodb').ObjectID;
const MAILURL = process.env.MAILURL;

var cloudinary = require('cloudinary')
MongoClient = require('mongodb').MongoClient,
    cloudinary.config({
        cloud_name: process.env.cloudinary_name,
        api_key: process.env.cloudinary_key,
        api_secret: process.env.cloudinary_secret
    });

function createUser(req, res) {
    const { password } = req.body;
    req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const data = req.body
    return customerdao.createuser(data).then((result) => {
        let token = (result.accountType == accountType.SUPERADMIN) ? util.generateToken(result, process.env.ADMIN_SECRET) : util.generateToken(result, process.env.USER_SECRET);
        let data = {
            _id: result._id,
            email: result.email,
            accountType: result.accountType,
            name: result.name
        }
        res.json({ code: code.created, message: msg.registered, token: token, data: data })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}
function authenticateUser(req, res) {
    let { email, password } = req.body;
    let query = { email: email, status: status.active }
    return customerdao.finduser(query).then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else if (!result.password) {
            res.json({ code: code.badRequest, message: msg.socialLoggedin })
        }
        else if (bcrypt.compareSync(password, result.password)) 
        {
            console.log("===================>",result.accountType,result.accountType == accountType.SUPERADMIN)
            let token = (result.accountType == accountType.SUPERADMIN) ? util.generateToken(result, process.env.ADMIN_SECRET) : util.generateToken(result, process.env.USER_SECRET);
            let data = {
                _id: result._id,
                email: result.email,
                accountType: result.accountType,
                name: result.name
            }
            res.json({ code: code.ok, message: msg.loggedIn, token: token, data: data })
        }
        else {
            res.json({ code: code.badRequest, message: msg.invalidPassword })

        }
    }).catch((err) => {
        console.log("authenticateUser -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function addtosave(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id };
    let businessId = req.body.id
    customerdao.finduser(query).then((result) => {
        if (result.savelist.length != 0) {
            console.log("in If")
            result.savelist.map(function (item, i) {
                console.log("addtosave -> item", item._id)
                if (item.businessid == req.body.id) {
                    customerdao.findOneAndUpdate({ _id: obj.id },
                        { $pull: { savelist: { businessid: ObjectId(req.body.id) } } },
                        { safe: true, multi: true }).then((result) => {
                            businessdao.findOneAndUpdate({ _id: req.body.id },
                                { $pull: { usersaved: { userId: ObjectId(obj.id) } } },
                                { safe: true, multi: true }
                            ).then((result) => {
                                res.json({ code: code.ok, message: msg.removedfromsaved })
                            })
                        })

                } else {
                    let businessObj = {
                        userId: obj.id
                    }
                    let userObj = {
                        businessid: req.body.id
                    }
                    let query = { _id: obj.id },
                        update = { $push: { savelist: userObj } },
                        options = { new: true }
                    customerdao.findOneAndUpdate(query, update, options).then((data) => {
                        let query1 = { _id: req.body.id },
                            update1 = { $push: { usersaved: businessObj } },
                            options1 = { new: true }
                        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                            res.json({ code: code.ok, message: msg.addedtosaved })
                        })
                    })
                }
            })
        }
        else {
            let businessObj = {
                userId: obj.id
            }
            let userObj = {
                businessid: req.body.id
            }
            let query = { _id: obj.id },
                update = { $push: { savelist: userObj } },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then((data) => {
                let query1 = { _id: req.body.id },
                    update1 = { $push: { usersaved: businessObj } },
                    options1 = { new: true }
                businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                    res.json({ code: code.ok, message: msg.addedtosaved })
                })
            })
        }
    }).catch((err) => {
        console.log("addtosave -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}

function addtowanttogo(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id };
    let businessId = req.body.id
    customerdao.finduser(query).then((result) => {
        if (result.wanttogolist.length != 0) {
            console.log("in If")
            result.wanttogolist.forEach(function (item, i) {
                console.log("addtosave -> item", item._id)
                if (item.businessid == req.body.id) {
                    customerdao.findOneAndUpdate({ _id: obj.id },
                        { $pull: { wanttogolist: { businessid: ObjectId(req.body.id) } } },
                        { safe: true, multi: true }).then((result) => {
                            businessdao.findOneAndUpdate({ _id: req.body.id },
                                { $pull: { userwanttogo: { userId: ObjectId(obj.id) } } },
                                { safe: true, multi: true }
                            ).then((result) => {
                                res.json({ code: code.ok, message: msg.removedfromwanttogo })
                            })
                        })

                } else {
                    let businessObj = {
                        userId: obj.id
                    }
                    let userObj = {
                        businessid: req.body.id
                    }
                    let query = { _id: obj.id },
                        update = { $push: { wanttogolist: userObj } },
                        options = { new: true }
                    customerdao.findOneAndUpdate(query, update, options).then((data) => {
                        let query1 = { _id: req.body.id },
                            update1 = { $push: { userwanttogo: businessObj } },
                            options1 = { new: true }
                        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                            res.json({ code: code.ok, message: msg.addedtowantogo })
                        })
                    })
                }
            })
        }
        else {
            let businessObj = {
                userId: obj.id
            }
            let userObj = {
                businessid: req.body.id
            }
            let query = { _id: obj.id },
                update = { $push: { wanttogolist: userObj } },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then((data) => {
                let query1 = { _id: req.body.id },
                    update1 = { $push: { userwanttogo: businessObj } },
                    options1 = { new: true }
                businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                    res.json({ code: code.ok, message: msg.addedtowantogo })
                })
            })
        }
    }).catch((err) => {
        console.log("addtosave -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}
function addtovisited(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id };
    let businessId = req.body.id
    customerdao.finduser(query).then((result) => {
        if (result.visitedlist.length != 0) {
            console.log("in If")
            result.visitedlist.forEach(function (item, i) {
                console.log("addtosave -> item", item._id)
                if (item.businessid == req.body.id) {
                    customerdao.findOneAndUpdate({ _id: obj.id },
                        { $pull: { visitedlist: { businessid: ObjectId(req.body.id) } } },
                        { safe: true, multi: true }).then((result) => {
                            businessdao.findOneAndUpdate({ _id: req.body.id },
                                { $pull: { uservisited: { userId: ObjectId(obj.id) } } },
                                { safe: true, multi: true }
                            ).then((result) => {
                                res.json({ code: code.ok, message: msg.removedfromvisited })
                            })
                        })

                } else {
                    let businessObj = {
                        userId: obj.id
                    }
                    let userObj = {
                        businessid: req.body.id
                    }
                    let query = { _id: obj.id },
                        update = { $push: { visitedlist: userObj } },
                        options = { new: true }
                    customerdao.findOneAndUpdate(query, update, options).then((data) => {
                        let query1 = { _id: req.body.id },
                            update1 = { $push: { uservisited: businessObj } },
                            options1 = { new: true }
                        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                            res.json({ code: code.ok, message: msg.addedtovisited })
                        })
                    })
                }
            })
        }
        else {
            let businessObj = {
                userId: obj.id
            }
            let userObj = {
                businessid: req.body.id
            }
            let query = { _id: obj.id },
                update = { $push: { visitedlist: userObj } },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then((data) => {
                let query1 = { _id: req.body.id },
                    update1 = { $push: { uservisited: businessObj } },
                    options1 = { new: true }
                businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
                    res.json({ code: code.ok, message: msg.addedtovisited })
                })
            })
        }
    }).catch((err) => {
        console.log("addtosave -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })

}




function forgotPassword(req, res) {
    let query = { email: req.body.email, isDeleted: false }
    customerdao.finduser(query).then((result) => {
        console.log("forgotPassword -> result", result)
        if (!result) return res.json({ code: code.notFound, message: msg.userNotFound });
        else {
            let token = crypto.randomBytes(20).toString('hex'),
                expiry = Date.now() + 3600000,
                query = { email: req.body.email },
                update = {
                    $set: {
                        resetPasswordToken: token,
                        resetPasswordExpires: expiry
                    }
                },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then(async (user) => {
                let link = MAILURL + "user/reset/" + user.resetPasswordToken;
                let data = {
                    username: user.name,
                    subject: "Reset Password Link",
                    html: `Hi ${user.name} \n 
                    Please click on ${link} to reset your password. \n\n 
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
                }
                await util.sendEMail(user.email, data).then((data) => {
                    return (data == true) ? res.json({ code: code.ok, message: `Link send on ${result.email}` })
                        : res.json({ code: code.notImplemented, message: msg.mailNotSent })
                })
            })
        }
    }).catch((err) => {
        console.log("forgotPassword -> err", err)
        console.error({ err })

    })
}
function changePassword(req, res) {
    let obj = util.decodeToken(req.headers['authorization']),
        newpass = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10))
    let query = { _id: obj.id, isDeleted: false }
    return customerdao.finduser(query).then((data) => {
        if (!data) {
            return res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            if (bcrypt.compareSync(req.body.oldPassword, data.password)) {
                query = { _id: data._id }
                let update = { password: newpass },
                    options = { new: true }
                customerdao.findOneAndUpdate(query, update, options).then((result) => {
                    res.json({ code: code.ok, message: msg.passwordChanged })
                })
            }
            else {
                return res.json({ code: code.badRequest, message: msg.wrongPassword })
            }
        }
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function updateProfile(req, res) {
    let obj = util.decodeToken(req.headers['authorization'])
    let query = { _id: obj.id, isDeleted: false },
        update = { $set: req.body },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.profileUpdated })
        }
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function getresetpassword(req, res) {
    let query = { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }, isDeleted: false }
    customerdao.finduser(query)
        .then((user) => {
            if (!user) return res.json({ code: code.unAuthorized, message: msg.tokeninvalidorexpire })
            else res.render('reset.jade', { user });
        })
        .catch(err => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })
        });
}
function resetpassword(req, res) {
    let query = { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }, isDeleted: false }
    customerdao.finduser(query).then((result) => {
        if (!result) return res.json({ code: code.unAuthorized, message: msg.tokeninvalidorexpire })
        else {
            const { password } = req.body;
            let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                query = { resetPasswordToken: req.params.token },
                update = { $set: { password: hash, resetPasswordToken: "", resetPasswordExpires: "" } },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then(async (user) => {
                let data = {
                    username: user.name,
                    subject: "Your Password has been changed",
                    html: `Hi ${user.name} \n 
                    //                         This is a confirmation that the password for your account ${user.email} has just been changed.\n`
                }
                await util.sendEMail(user.email, data).then((data) => {
                    return (data == true) ? res.json({ code: code.ok, message: msg.passwordChanged })
                        : res.json({ code: code.notImplemented, message: msg.mailNotSent })
                })
            })
        }
    }).catch((err) => {
        console.error({ err })

    })
}
function listvisited(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customer.findOne({ _id: obj.id, isDeleted: false }).populate('visitedlist.businessid', '_id name location').then((result) => {
        res.json({ code: code.ok, data: result.visitedlist })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}
function listwanttogo(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customer.findOne({ _id: obj.id, isDeleted: false }).populate('wanttogolist.businessid', '_id name location').then((result) => {
        res.json({ code: code.ok, data: result.wanttogolist })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}
function listsaved(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customer.findOne({ _id: obj.id, isDeleted: false }).populate('savelist.businessid', '_id name location').then((result) => {
        res.json({ code: code.ok, data: result.savelist })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}
function listusers(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customerdao.finduser({ _id: obj.id, isDeleted: false }).then(async (user) => {
        let query = { "accountType": req.body.filter, _id: { $nin: user.blockedList } }
        if (req.body.filter == accountType.BUSSINESSUSER) {
            customer.find(query, { name: 1, email: 1, imageUrl: 1, _id: 1 }).populate('businessId', 'typeOfBusiness name').then((result) => {

                res.json({ code: code.ok, data: result })

            }).catch((err) => {
                res.json({ code: code.ineternalError, message: msg.internalServerError })

            })
        } else {
            return customer.find(query, { name: 1, email: 1, imageUrl: 1, _id: 1 }).then((result) => {
                res.json({ code: code.ok, data: result })
            }).catch((err) => {
                res.json({ code: code.ineternalError, message: msg.internalServerError })

            })
        }

    })
}
function userdetail(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customerdao.finduser({ _id: obj.id, isDeleted: false }).then(async (result) => {
        let query = { "accountType": result.accountType, "_id": obj.id }
        console.log("listusers -> query", query)
        if (result.accountType == accountType.BUSSINESSUSER) {
            await customer.find(query).populate('businessId', 'typeOfBusiness name status approve address').then(async (result) => {

                let data = []
                await result.map((ele) => {
                    let obj = {
                        accountType: ele.accountType,
                        status: ele.status,
                        savelist: ele.savelist,
                        wanttogolist: ele.wanttogolist,
                        visitedlist: ele.visitedlist,
                        businessId: ele.businessId,
                        _id: ele._id,
                        name: ele.name,
                        email: ele.email,
                        imageUrl: ele.imageUrl
                    }
                    data.push(obj)
                })
                res.json({ code: code.ok, data: data })

            })
        } else {
            customer.find(query).populate('visitedlist', 'name').populate('wanttogolist', 'name').populate('savelist', 'name').then(async (result) => {
                let data = []
                await result.map((ele) => {
                    let obj = {
                        accountType: ele.accountType,
                        status: ele.status,
                        savelist: ele.savelist,
                        wanttogolist: ele.wanttogolist,
                        visitedlist: ele.visitedlist,
                        businessId: ele.businessId,
                        _id: ele._id,
                        name: ele.name,
                        email: ele.email,
                        imageUrl: ele.imageUrl
                    }
                    data.push(obj)
                })
                res.json({ code: code.ok, data: data })
            })
        }

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function uploadPhoto(req, res) {
    req.newFile_name = [];
    console.log("in upload photo", req.newFile_name)
    util.upload(req, res, async function (err) {
        if (err) {
            return res.json({ code: code.badRequest, message: err })
        }
        else {
            const files = req.files;
            let index, len;
            var filepathlist = []
            for (index = 0, len = files.length; index < len; ++index) {
                console.log("uploadPhoto -> files[index].path", files[index].path)
                let filepath = process.env.IMAGEPREFIX + files[index].path.slice(4,);;
                filepathlist.push(filepath)
            }
            return res.json({ code: code.created, message: msg.ok, data: filepathlist })
        }
    });
}
function socialloginGmail(req, res) {
    // const { id, email, name } = req.body;
    const name = req.body.name.trim(),
        socialId = req.body.id.trim(),
        email = req.body.email.trim();
    if (req.body.photo) {

        imageUrl = req.body.photo.trim()
    }
    else {
        imageUrl = ""
    }


    let query = { $or: [{ socialId: socialId }, { email: email }], isDeleted: false };
    update = { $set: { email: email, name: name, isSocialLogin: true, imageUrl: imageUrl } },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then(async (result) => {
        if (!result) {
            req.body.isSocialLogin = true
            req.body.accountType = accountType.CUSTOMER
            const data = {
                isSocialLogin: true,
                name: req.body.name.trim(),
                socialId: req.body.id.trim(),
                email: req.body.email.trim()
            }
            if (req.body.photo) {

                data.imageUrl = req.body.photo;
            }
            return customerdao.createuser(data).then((user) => {
                console.log("socialloginGmail -> result", user)
                let token = util.generateToken(user, process.env.USER_SECRET)
                let data = {
                    _id: user._id,
                    email: user.email,
                    accountType: user.accountType,
                    name: user.name,
                    imageUrl: user.imageUrl,
                    token: token
                }
                return res.json({ code: code.ok, message: msg.loggedIn, data: data })
            })
        }
        else {
            let token = util.generateToken(result, process.env.USER_SECRET)
            let data = {
                _id: result._id,
                email: result.email,
                accountType: result.accountType,
                name: result.name,
                imageUrl: result.imageUrl,
                token: token
            }
            return res.json({ code: code.ok, message: msg.loggedIn, data: data })
        }
    }).catch((err) => {
        console.log("socialloginGmail -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function socialloginFacebook(req, res) {
    // const { id, email, name } = req.body;
    const name = req.body.name.trim(),
        socialId = req.body.id.trim(),
        email = req.body.email.trim();
    if (req.body.imageUrl) {

        imageUrl = req.body.photo.trim()
    }
    else {
        imageUrl = ""
    }

    let query = { $or: [{ socialId: socialId }, { email: email }], isDeleted: false };
    update = { $set: { email: email, name: name, isSocialLogin: true, imageUrl: imageUrl } },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then(async (result) => {
        if (!result) {
            req.body.isSocialLogin = true
            req.body.accountType = accountType.CUSTOMER
            const data = {
                isSocialLogin: true,
                name: req.body.name.trim(),
                socialId: req.body.id.trim(),
                email: req.body.email.trim()
            }
            if (req.body.photo) {

                data.imageUrl = req.body.photo;
            }
            return customerdao.createuser(data).then((user) => {
                let token = util.generateToken(user, process.env.USER_SECRET)
                let data = {
                    _id: user._id,
                    email: user.email,
                    accountType: user.accountType,
                    name: user.name,
                    imageUrl: user.imageUrl,
                    token: token
                }
                console.log("socialloginFacebook -> data", data)
                return res.json({ code: code.ok, message: msg.loggedIn, data: data })
            })
        }
        else {
            let token = util.generateToken(result, process.env.USER_SECRET)
            let data = {
                _id: result._id,
                email: result.email,
                accountType: result.accountType,
                name: result.name,
                imageUrl: result.imageUrl,
                token: token
            }
            console.log("socialloginFacebook -> data", data)
            return res.json({ code: code.ok, message: msg.loggedIn, data: data })
        }
    }).catch((err) => {
        console.log("socialloginFacebook -> catch", err)

        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function socialloginLinkedin(req, res) {
    console.log("socialloginLinkedin -> req=================================================", req.body)
    const name = req.body.firstName.trim(),
        socialId = req.body.socialId.trim(),
        email = req.body.email.trim();
    if (req.body.imageUrl) {

        imageUrl = req.body.imageUrl.trim()
    }
    else {
        imageUrl = ""
    }

    let query = { $or: [{ socialId: socialId }, { email: email }], isDeleted: false };
    update = { $set: { email: email, name: name, isSocialLogin: true, imageUrl: imageUrl } },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then(async (result) => {
        if (!result) {
            req.body.isSocialLogin = true
            req.body.accountType = accountType.CUSTOMER
            const data = {
                isSocialLogin: true,
                name: req.body.firstName.trim(),
                socialId: req.body.socialId.trim(),
                email: req.body.email.trim()
            }
            if (req.body.imageUrl) {

                data.imageUrl = req.body.imageUrl;
            }
            return customerdao.createuser(data).then((user) => {
                let token = util.generateToken(user, process.env.USER_SECRET)
                let data = {
                    _id: user._id,
                    email: user.email,
                    accountType: user.accountType,
                    name: user.name,
                    imageUrl: user.imageUrl,
                    token: token
                }
                console.log("socialloginlinkedin -> data----------create", data)
                return res.json({ code: code.ok, message: msg.loggedIn, data: data })
            })
        }
        else {
            let token = util.generateToken(result, process.env.USER_SECRET)
            let data = {
                _id: result._id,
                email: result.email,
                accountType: result.accountType,
                name: result.name,
                imageUrl: result.imageUrl,
                token: token
            }
            console.log("socialloginlinkedin -> data------------login", data)
            return res.json({ code: code.ok, message: msg.loggedIn, data: data })
        }
    }).catch((err) => {
        console.log("socialloginlinkedin -> catch", err)

        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function blockUser(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id, isDeleted: false };
    customerdao.finduser(query).then((result) => {
        let match = result.blockedList.includes(req.query.id)
        let userId = req.query.id
        if (match == true) {
            customerdao.findOneAndUpdate({ _id: obj.id },
                { "$pull": { "blockedList": ObjectId(userId) } },
                { safe: true, multi: true }).then((result) => {
                    res.json({ code: code.ok, msg: msg.userUnblocked })
                })
        } else {
            let query = { _id: obj.id },
                update = { $push: { blockedList: req.query.id } },
                options = { new: true }
            customerdao.findOneAndUpdate(query, update, options).then((data) => {
                res.json({ code: code.ok, msg: msg.userBlocked })
            })
        }

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}
function blockuserlist(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customer.find({ _id: obj.id, isDeleted: false }).populate('blockedList', '_id name').then((result) => {
        res.json({ code: code.ok, data: result.blockedList })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}
function reportUser(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let reporteduserObj = {
        id: req.query.id,
        by: obj.id,
        reason: req.body.reason
    }
    let query = { accountType: accountType.SUPERADMIN }
    update = { $push: { reporteduser: reporteduserObj } },
        options = { new: true }
    customerdao.findOneAndUpdate(query, update, options).then((result) => {

        res.json({ code: code.ok, msg: msg.reported })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}
//isDeleted true in both 
function deleteAcc(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id }
    console.log("deleteAcc -> query", query)
    customerdao.finduser(query).then(async (result) => {
        if (!result) {
            await res.json({ code: code.notFound, msg: msg.recordNotFound })
        } else {
            if (result.businessId) {
                let query = { _id: result.businessId },
                    update = { $set: { isDeleted: true } },
                    options = { new: true }
                businessdao.findOneAndUpdate(query, update, options).then(async (result2) => {
                    let query = { _id: result._id },
                        update = { $set: { isDeleted: true } },
                        options = { new: true }
                    await customerdao.findOneAndUpdate(query, update, options).then((data) => {
                        res.json({ code: code.ok, msg: msg.accountDel })
                    })
                })
            }
            else if (!result.businessId) {
                let query = { _id: result._id },
                    update = { $set: { isDeleted: true } },
                    options = { new: true }
                customerdao.findOneAndUpdate(query, update, options).then((data) => {
                    res.json({ code: code.ok, msg: msg.accountDel })
                })
            }
        }
    }).catch((err) => {
        console.log("deleteAcc -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError, err: err })
    })
}
function addSuggestion(req, res) {
    let token = req.headers['authorization']
    var obj = util.decodeToken(token)
    console.log("addSuggestion -> obj", obj)
    let suggestionObj = {
        by: obj.id,
        data: req.body.suggestion
    }
    let query = { accountType: accountType.SUPERADMIN },
        update = { $push: { suggestion: suggestionObj } },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.suggestionAdd })
        }
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function addtosave1(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let businessId = req.body.id
    let businessObj = {
        userId: obj.id
    }
    let userObj = {
        businessid: req.body.id
    }
    let query = { _id: obj.id },
        update = { $push: { savelist: userObj } },
        options = { new: true }
    customerdao.findOneAndUpdate(query, update, options).then((data) => {
        let query1 = { _id: req.body.id },
            update1 = { $push: { usersaved: businessObj } },
            options1 = { new: true }
        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
            res.json({ code: code.ok, message: msg.addedtosaved })
        }).catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })
        })
    })
}
function removefromsave(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    customerdao.findOneAndUpdate({ _id: obj.id },
        { $pull: { savelist: { businessid: ObjectId(req.body.id) } } },
        { safe: true, multi: true }).then((result) => {
            businessdao.findOneAndUpdate({ _id: req.body.id },
                { $pull: { usersaved: { userId: ObjectId(obj.id) } } },
                { safe: true, multi: true }
            ).then((result) => {
                res.json({ code: code.ok, message: msg.removedfromsaved })
            })
        })
}
function removefromvisited(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    // let query = { _id: obj.id };
    customerdao.findOneAndUpdate({ _id: obj.id },
        { $pull: { visitedlist: { businessid: ObjectId(req.body.id) } } },
        { safe: true, multi: true }).then((result) => {
            businessdao.findOneAndUpdate({ _id: req.body.id },
                { $pull: { uservisited: { userId: ObjectId(obj.id) } } },
                { safe: true, multi: true }
            ).then((result) => {
                res.json({ code: code.ok, message: msg.removedfromvisited })
            }).catch((err) => {
                res.json({ code: code.ineternalError, message: msg.internalServerError })
            })
        })
}
function addtovisited1(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let businessObj = {
        userId: obj.id
    }
    let userObj = {
        businessid: req.body.id
    }
    let query = { _id: obj.id },
        update = { $push: { visitedlist: userObj } },
        options = { new: true }
    customerdao.findOneAndUpdate(query, update, options).then((data) => {
        let query1 = { _id: req.body.id },
            update1 = { $push: { uservisited: businessObj } },
            options1 = { new: true }
        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
            res.json({ code: code.ok, message: msg.addedtovisited })
        })
    })
}
function addtowanttogo1(req,res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    // let query = { _id: obj.id };
    let businessObj = {
        userId: obj.id
    }
    let userObj = {
        businessid: req.body.id
    }
    let query = { _id: obj.id },
        update = { $push: { wanttogolist: userObj } },
        options = { new: true }
    customerdao.findOneAndUpdate(query, update, options).then((data) => {
        let query1 = { _id: req.body.id },
            update1 = { $push: { userwanttogo: businessObj } },
            options1 = { new: true }
        businessdao.findOneAndUpdate(query1, update1, options1).then((result) => {
            res.json({ code: code.ok, message: msg.addedtowantogo })
        }).catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })
        })
    })
}
function removefromwanttogo(req,res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    // let query = { _id: obj.id };
    customerdao.findOneAndUpdate({ _id: obj.id },
        { $pull: { wanttogolist: { businessid: ObjectId(req.body.id) } } },
        { safe: true, multi: true }).then((result) => {
            businessdao.findOneAndUpdate({ _id: req.body.id },
                { $pull: { userwanttogo: { userId: ObjectId(obj.id) } } },
                { safe: true, multi: true }
            ).then((result) => {
                res.json({ code: code.ok, message: msg.removedfromwanttogo })
            }).catch((err) => {
                res.json({ code: code.ineternalError, message: msg.internalServerError })
            })
        })

}
module.exports = {
    createUser,
    authenticateUser,
    addtosave,
    addtowanttogo,
    addtovisited,
    forgotPassword,
    getresetpassword,
    resetpassword,
    changePassword,
    updateProfile,
    listvisited,
    listwanttogo,
    listsaved,
    listusers,
    userdetail,
    uploadPhoto,
    socialloginGmail,
    socialloginFacebook,
    socialloginLinkedin,
    blockUser,
    blockuserlist,
    reportUser,
    deleteAcc,
    addSuggestion,


    addtosave1,
    removefromsave,
    removefromvisited,
    addtovisited1,
    addtowanttogo1,
    removefromwanttogo


}