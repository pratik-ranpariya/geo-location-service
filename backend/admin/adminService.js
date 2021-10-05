const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const bcrypt = require('bcrypt');
const admindao = require('./adminDao');
const customerdao = require('../customer/customerDao')
const customer = require('../schema/user');
const { accountType, roles } = require('../constants');
const business = require('../schema/business');
const bussinessdao = require('../business/businessDao');
var zipcodes = require('zipcodes');
const businessDao = require('../business/businessDao');
const customerDao = require('../customer/customerDao');
function addbusiness(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)

    let business = req.body.uniquebusiness
    business.map((element) => {
        var hills = zipcodes.lookup(element.zipcode);
        element.location = {
            type: "Point",
            coordinates: [
                hills.longitude,//longitude goes first
                hills.latitude
            ]
        }
        if (hills == undefined) {
            return res.json({ code: code.badRequest, message: msg.invalidZipcode, data: element.zipcode })
        }
        let avail = []
        avail.push(JSON.parse(element.availablity))
        element.availablity = avail//[{element.availablity1}]
        element.availablity = element.availablity[0]
        element.status = "ACTIVE",
            // element.approve = true
            element.createdBy = obj.id
    })
    return bussinessdao.create(business).then(async (result) => {
        result.map((business) => {

            // add id of bussiness into users data
            let query = { _id: business.createdBy },
                update = { $push: { businessId: business._id } },
                options = { new: true }
            return customerdao.findOneAndUpdate(query, update, options).then((result) => {
                if (!result) {
                    res.json({ code: code.notFound, message: msg.userNotFound })
                }
                else {
                    res.json({ code: code.ok, message: msg.businessregister })
                }
            })
        })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}



function addcategory(req, res) {
    const data = req.body
    return admindao.create(data).then((result) => {
        res.json({ code: code.created, message: msg.catadded })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })

}
function updatecategory(req, res) {
    let query = { _id: req.query.id },
        update = { $set: { name: req.body.name, imageUrl: req.body.imageUrl } },
        options = { new: true };
    return admindao.findOneAndUpdate(query, update, options).then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        } else {

            res.json({ code: code.ok, data: result })
        }
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function listcategory(req, res) {
    return admindao.find().then((result) => {
        res.json({ code: code.ok, data: result })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function deletecategory(req, res) {

    let query = { _id: req.query.id };
    return admindao.remove(query).then((result) => {
        res.json({ code: code.ok, message: msg.catdeleted })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function removebusiness(req, res) {
    let query = { _id: req.query.id };
    // get queryid then find remove from list first then remove from db
    bussinessdao.findone(query).then((result) => {

        let query = {
            _id: result.createdBy
        }, update = { businessId: null },
            options = { new: true };

        customerdao.findOneAndUpdate(query, update, options).then((result) => {

            let query = { _id: req.query.id };
            update = { $set: { isDeleted: true } },
                options = { new: true }
            return businessDao.findOneAndUpdate(query, update, options).then((result) => {
                res.json({ code: code.ok, message: msg.busdeleted })

            })

        })
    })
        .catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })

        })
}
function listuser(req, res) {
    let query = { "accountType": req.query.filter, isDeleted: false }
    if (req.query.filter == accountType.BUSSINESSUSER) {
        customer.find(query).populate('businessId', 'typeOfBusiness name').then((result) => {

            res.json({ code: code.ok, data: result })

        }).catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })

        })
    } else {
        customer.find(query).populate('visitedlist', 'name').populate('wanttogolist', 'name').populate('savelist', 'name').then((result) => {

            res.json({ code: code.ok, data: result })
        }).catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })

        })
    }
}
function removeuser(req, res) {//these is only for customers
    let query = { _id: req.query.id }
    update = { $set: { isDeleted: true } },
        options = { new: true }
    return customerdao.findOneAndUpdate(query, update, options).then((result) => {
        res.json({ code: code.ok })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function createadmin() {
    customerdao.finduser({ "accountType": accountType.SUPERADMIN }).then(async (data) => {
        if (!data || data.length == 0) {
            const obj = {
                "name": "Admin",
                "email": process.env.ADMIN_EMAIL,
                "password": process.env.ADMIN_PASSWORD,
                "accountType": accountType.SUPERADMIN
            }
            let updatedPass = await bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10));
            obj.password = updatedPass;
            return customerdao.createuser(obj).then((result) => {
                console.log("=================Admin created========================")
            })
        }
    }).catch((err) => {
        console.error({ err })
    })

}
function verifyToken(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        return res.json({ status: 0, message: msg.tokenNotPrvided, data: {} })
    } else {
        util.verifyUsrToken(token).then((result) => {
            if (result) {
                return res.json({ code: code.ok, message: "Token valid" })
            } else {
                return res.json({ status: 0, message: msg.internalServerError, err: err })
            }
        }).catch(err => {
        console.log("verifyToken -> err", err)
            return res.json({ status: 0, message: msg.inValidToken })
        })
    }
}

function listbusiness(req, res) {
    business.find({ isDeleted: false }).populate('createdBy', 'name').then((result) => {
        res.json({ code: code.ok, data: result })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}

function businessreq(req, res) {
    let query = { _id: req.query.id },
        update = { $set: { approve: req.body.status } },
        options = { new: true }
    return bussinessdao.findOneAndUpdate(query, update, options).then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.businessUpdated })
        }
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })

}
function listSuggestion(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    // let query = { _id: obj.id }
    let query = { accountType: accountType.SUPERADMIN }
    customer.findOne(query).populate('suggestion.by', '_id name').then((result) => {
        res.json({ code: code.ok, data: result.suggestion })

    }).catch((err) => {

        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function listreportedUsers(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { accountType: accountType.SUPERADMIN }
    // let query = { _id: obj.id }
    customer.findOne(query).populate('reporteduser.by', '_id name').populate('reporteduser.id', '_id name').then((result) => {
        res.json({ code: code.ok, data: result.reporteduser })

    }).catch((err) => {

        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
module.exports = {
    addbusiness,
    addcategory,
    updatecategory,
    listcategory,
    deletecategory,
    listuser,
    removeuser,
    createadmin,
    verifyToken,
    listbusiness,
    businessreq,
    removebusiness,
    listSuggestion,
    listreportedUsers

}
