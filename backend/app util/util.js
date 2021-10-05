const jwt = require('jsonwebtoken')
const generator = require('generate-password')
const nodemailer = require('nodemailer')
const CODE = require('../constants/index').http_codes;
const MSG = require('../constants/index').messages;
// var cloudinary = require('cloudinary')
// MongoClient = require('mongodb').MongoClient,
//     cloudinary.config({
//         cloud_name: process.env.cloudinary_name,
//         api_key: process.env.cloudinary_key,
//         api_secret: process.env.cloudinary_secret
//     });
var fs = require('fs')
var path = require('path')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './img');
    },
    filename: function (req, file, callback) {
        let file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        req.newFile_name.push(file_name);
        callback(null, file_name);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback)
    }

}).array('img', 5);

// cloudinary.config({
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret
// })

function validateEmail(data) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(data)
}

function validatePassword(data) {
    let regex = /^(?=.*[A-z])(?=.*[0-9])(?=.*[@#$_-])\S{8,20}$/;
    return regex.test(data)
}

function generateToken(data, secret) {
    let obj = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
    }
    return jwt.sign(obj, secret, { expiresIn: '720hr' })
}
async function sendEMail(receiverid, data) {
    var tansporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.USERID,
            pass: process.env.PASSWORD
        }
    })


    var mailoption = {

        from: `<${process.env.USERID}>`,
        to: receiverid,
        subject: data.subject,
        // text: 'That was easy!'
        html: data.html

    }
    return new Promise(function (resolve, reject) {
        tansporter.sendMail(mailoption, (err) => {
            (err) ? reject(err) : resolve(true)
        })
    })

}

function generateRandomPassword() {
    return generator.generate({
        length: 10,
        numbers: true
    })
}

function decodeToken(token) {
    return jwt.decode(token)
}
var verifyUsrToken = async function (jwtToken) {
    try {
        let payload = await jwt.verify(jwtToken, process.env.ADMIN_SECRET);
        console.log("payload", payload)
        return payload
    } catch (e) {
        return({ code: CODE.BADREQUEST, message: MSG.internalServerError })
    }
};





function checkFileType(file, callback) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    if (extName) {
        return callback(null, true);
    }
    else {
        callback('Error:Images only!')
    }
}











module.exports = {
    validateEmail,
    validatePassword,
    generateToken,
    sendEMail,
    generateRandomPassword,
    decodeToken,
    verifyUsrToken,
    upload,
    checkFileType
}