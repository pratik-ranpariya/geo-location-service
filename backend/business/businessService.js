const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const status = require('../constants').status;
const role = require('../constants').roles;
const bcrypt = require('bcrypt');
const bussinessdao = require('./businessDao');
const crypto = require('crypto');
const business = require('../schema/business')
const customerdao = require('../customer/customerDao');
const { google } = require('googleapis');
const MAILURL = process.env.MAILURL;
var $;
$ = require("jquery");
function addbusiness(req, res) {
    let token = req.headers['authorization']
    let obj = util.decodeToken(token)
    let query = { _id: obj.id }
    customerdao.finduser(query).then((data) => {
        if (data.businessId) {
            // console.log("Already added")
            res.json({ code: code.badRequest, message: msg.onlyOne })
        } else {

            req.body.createdBy = obj.id;
            req.body.category = ObjectId(req.body.category)
            req.body.businessActivateToken = crypto.randomBytes(20).toString('hex');
            req.body.businessActivateExpires = Date.now() + 3600000; //expires in an hour
            const data = req.body
            return bussinessdao.create(data).then(async (result) => {
                let link = MAILURL + "business/business_activate/" + result.businessActivateToken;
                let data = {
                    username: result.name,
                    subject: "Business Activation Link",
                    html: `Hi ${result.name} \n 
            Please click on the following link ${link} to activate your business. \n\n 
            If you did not request this, please ignore this email.\n`
                }
                await util.sendEMail(result.email, data).then((data) => {
                    return (data == true) ? res.json({ code: code.ok, message: msg.linksendonemail })
                        : res.json({ code: code.notImplemented, message: msg.mailNotSent })
                })
                //add id of bussiness into users data
                let query = { _id: result.createdBy },
                    update = { businessId: result._id },
                    options = { new: true }
                return customerdao.findOneAndUpdate(query, update, options).then((result) => {
                    if (!result) {
                        res.json({ code: code.notFound, message: msg.userNotFound })
                    }
                    else {
                        res.json({ code: code.ok, message: msg.profileUpdated })
                    }
                })
            })
        }

    }).catch((err) => {
        console.log("addbusiness -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function activatelink(req, res) {
    let query = { businessActivateToken: req.params.token, businessActivateExpires: { $gt: Date.now() }, isDeleted: false }
    bussinessdao.findone(query).then((result) => {
        if (!result) return res.json({ code: code.unAuthorized, message: msg.tokeninvalidorexpire })
        else {
            res.redirect('bleapp://activeBusiness/' + result.businessActivateToken)
        }
        // res.render('business_activate.jade', { result });//redirect to deep linking url

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function activatebusiness(req, res) {
    let query = { businessActivateToken: req.params.token, businessActivateExpires: { $gt: Date.now() }, isDeleted: false }
    bussinessdao.findone(query).then((result) => {
        if (!result) return res.json({ code: code.unAuthorized, message: msg.tokeninvalidorexpire })
        else {
            let
                query = { businessActivateToken: req.params.token },
                update = { $set: { status: status.active, businessActivateToken: "", businessActivateExpires: "" } },
                options = { new: true }
            bussinessdao.findOneAndUpdate(query, update, options).then(async (data) => {
                let obj = {
                    username: data.name,
                    subject: "Business Activated",
                    html: `Hi ${data.name} \n 
                    //             This is a confirmation that the business status for your account ${data.email} has just been activated.\n`
                }
                await util.sendEMail(data.email, obj).then(async (result) => {
                    (result == true) ? res.json({ code: code.ok, message: msg.accountadded })
                        : res.json({ code: code.notImplemented, message: msg.mailNotSent })
                })
                if (data) {
                    // let link = "http://" + req.headers.host + "/business/approval?id=" + data._id;
                    let link = MAILURL + '/#/business?id=' + data._id;
                    console.log("activatebusiness -> link", link)
                    let objadmin = {
                        username: "Admin",
                        subject: "Business Approval",
                        html: `Hi Admin \n 
                        //Check ${link} to Approve/Declain business add request.\n`
                    }
                    await util.sendEMail(process.env.ADMIN_EMAIL, objadmin).then((result) => {
                        console.log("activatebusiness -> result", result)

                    })
                }
                //will send admin accept/decline link in mail from here
            })
        }
    }).catch((err) => {
        console.error({ err })

    })
}
function activatebusinesslink(req, res) {
    let query = { email: req.body.email, isDeleted: false }
    bussinessdao.findone(query).then((result) => {
        if (!result) return res.status(401).json({ code: code.notFound, message: msg.emailNotFound });
        else {
            let token = crypto.randomBytes(20).toString('hex'),
                expiry = Date.now() + 3600000,
                query = { email: req.body.email },
                update = {
                    $set: {
                        businessActivateToken: token,
                        businessActivateExpires: expiry
                    }
                },
                options = { new: true }
            bussinessdao.findOneAndUpdate(query, update, options).then(async (result) => {
                let link = MAILURL + "business/business_activate/" + result.businessActivateToken;
                console.log("activatebusinesslink -> link", link)
                let data = {
                    username: result.name,
                    subject: "Business Activation Link",
                    html: `Hi ${result.name} \n 
                    Please click on the following link ${link} to activate your business. \n\n 
                    If you did not request this, please ignore this email.\n`
                }
                await util.sendEMail(result.email, data).then((data) => {
                    return (data == true) ? res.json({ code: code.ok, message: `Link send on ${result.email}` })
                        : res.json({ code: code.notImplemented, message: msg.mailNotSent })
                })
            })
        }
    }).catch((err) => {
        console.error({ err })

    })
}
function updatebusiness(req, res) {
    if (req.body.category) {
        req.body.category = ObjectId(req.body.category)
    }
    let query = { _id: req.query.id, isDeleted: false },
        update = { $set: req.body },
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
function businesslist(req, res) {
    if (req.query.category) {
        var query = { "category": ObjectId(req.query.category), approve: true, isDeleted: false }
    } else {
        var query = { approve: true, isDeleted: false }
    }
    return business.find(query).populate('category', '_id name imageUrl').then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        }
        else {
            res.json({ code: code.ok, data: result })
        }
    }).catch((err) => {
        console.error({ err })
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function searchbusiness(req, res) {
    var query = { approve: true, isDeleted: false, name: { $regex: req.query.filter, $options: 'i' } };
    return business.find(query).populate('category', '_id name imageUrl').then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        } else {
            res.json({ code: code.ok, data: result })
        }
    }).catch((err) => {
        console.log("searchbusiness -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function businessdetail(req, res) {
    let query = { _id: req.query.id, isDeleted: false }
    return business.findOne(query).populate('category', '_id name imageUrl').then((result) => {
        if (!result) {
            res.json({ code: code.notFound, message: msg.recordNotFound })
        }
        else {
            res.json({ code: code.ok, data: result })
        }
    }).catch((err) => {
        console.error({ err })
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function listsave(req, res) {
    business.findOne({ _id: req.query.id, isDeleted: false }).populate('usersaved.userId', '_id name imageUrl').then((result) => {
        res.json({ code: code.ok, data: result.usersaved })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}
function listvisited(req, res) {
    business.findOne({ _id: req.query.id, isDeleted: false }).populate('uservisited.userId', '_id name imageUrl').then((result) => {
        res.json({ code: code.ok, data: result.uservisited })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function listwanttogo(req, res) {
    business.findOne({ _id: req.query.id, isDeleted: false }).populate('userwanttogo.userId', '_id name imageUrl').then((result) => {
        res.json({ code: code.ok, data: result.userwanttogo })

    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function nearby(req, res) {
    if (!req.query.radius) {
        req.query.radius = 100
    }
    if (req.query.category) {
        if(req.query.businessName){
            var query = {

                // location: {
                //     $nearSphere: {
                //         $geometry: { type: "Point", coordinates: [req.query.long, req.query.lat] },
                //         // $maxDistance: parseFloat(req.query.radius) * 1000
                //     }
                // },
                category: req.query.category,
                name: new RegExp(req.query.businessName, "gi"),//:req.body.businessName,
                approve: true,
                isDeleted: false
            }
        } else {
            var query = {

                // location: {
                //     $nearSphere: {
                //         $geometry: { type: "Point", coordinates: [req.query.long, req.query.lat] },
                //         $maxDistance: parseFloat(req.query.radius) * 1000
                //     }
                // },
                category: req.query.category,
                approve: true,
                isDeleted: false
            }
        }
        
    } else {
        if(req.query.businessName){
            var query = {
                // location: {
                //     $nearSphere: {
                //         $geometry: {
                //             type: "Point",
                //             coordinates: [req.query.long, req.query.lat]
                //         },
                //         $maxDistance: parseFloat(req.query.radius) * 1000
                //     }
                // },
                approve: true,
                name: new RegExp(req.query.businessName, "gi"),
                isDeleted: false
            }
        } else {
            var query = {
                // location: {
                //     $nearSphere: {
                //         $geometry: {
                //             type: "Point",
                //             coordinates: [req.query.long, req.query.lat]
                //         },
                //         $maxDistance: parseFloat(req.query.radius) * 1000
                //     }
                // },
                approve: true,
                isDeleted: false
            }
        }
        
    }
    
    business.find(query).populate('category', '_id name imageUrl').then(async (result) => {
        let distanceArray = []
        await result.map(async (ele, i) => {
            ele.distance = this.distance(req.query.lat, req.query.long, ele.location.coordinates[1], ele.location.coordinates[0])
            // Obj.distance = this.distance(req.query.lat, req.query.long, ele.location.coordinates[1], ele.location.coordinates[0])
            let Obj = {
                ...ele._doc,
                distance: ele.distance
            };
            distanceArray.push(Obj)
        })

        // console.log(distanceArray.length, '-------')

        // if (distanceArray[0]) {
            return res.json({ code: code.ok, data: distanceArray })
        // } else {
        //     let allData = {
        //         approve: true,
        //         isDeleted: false
        //     }
        //     business.find(allData).populate('category', '_id name imageUrl').then(async(results) => {
        //         let distanceArrays = []
        //         await results.map(async (ele, i) => {
        //             ele.distance = this.distance(req.query.lat, req.query.long, ele.location.coordinates[1], ele.location.coordinates[0])
        //             let Obj = {
        //                 ...ele._doc,
        //                 distance: ele.distance
        //             };
        //             distanceArrays.push(Obj)
        //         })
        //         return res.json({ code: code.ok, data: distanceArrays })
        //     })
        // }
        
    }).catch((err) => {
        // console.log(err)
        res.json({ code: code.ineternalError, message: msg.internalServerError, error:err })

    })
}


function Approvebusiness(req, res) {
    console.log("Approvebusiness -> req", req.query.id)
    res.render('approve_business.jade', { req });
}

function approvebusinessreq(req, res) {
    console.log("approvebusinessreq -> req", req)
    let query = { _id: req.query.id, isDeleted: false },
        update = { $set: { approve: true } },
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

// function addSuggestion(req, res) {
//     let token = req.headers['authorization']
//     var obj = util.decodeToken(token)
//     console.log("addSuggestion -> obj", obj)
//     let suggestionObj={
//         by:obj.id,
//         data:req.body.suggestion
//     }
//     let query = { _id: req.query.id },
//         update = { $push: { suggestion: suggestionObj } },
//         options = { new: true }
//     return bussinessdao.findOneAndUpdate(query, update, options).then((result) => {
//         if (!result) {
//             res.json({ code: code.notFound, message: msg.recordNotFound })
//         }
//         else {
//             res.json({ code: code.ok, message: msg.suggestionAdd })
//         }
//     }).catch((err) => {
//         res.json({ code: code.ineternalError, message: msg.internalServerError })
//     })
// }

// function listSuggestion(req, res) {
//     business.findOne({ _id: req.query.id }).populate('suggestion.by', '_id name').then((result) => {
//         res.json({ code: code.ok, data: result.suggestion })

//     }).catch((err) => {
//         res.json({ code: code.ineternalError, message: msg.internalServerError })

//     })
// }

function latlong(req, res) {
    var geocoder = new google.maps.Geocoder();
    var address = 364002;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            console.log("latlong -> latitude", latitude)
            console.log("latlong -> longitude", longitude)
            // alert("Latitude: " + latitude + "\nLongitude: " + longitude);
        } else {
            alert("Request failed.")
        }
    });
}
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        console.log("distance -> dist", dist)
        return dist;
    }
}
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
    Approvebusiness,
    approvebusinessreq,
    // addSuggestion,
    // listSuggestion,
    latlong,
    distance,
    searchbusiness
}