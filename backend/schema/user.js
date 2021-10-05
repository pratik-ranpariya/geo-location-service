const mongoose = require('mongoose');
const schema = mongoose.Schema;
const schmaName = require('../constants').schemas;
const accountType = require('../constants').accountType;
const status = require('../constants').status;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var userSchema = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        type: String, required: function () {
            return (this.isSocialLogin == false) ? true : false
        }
    },
    imageUrl: { type: String },
    age: { type: Number },
    isDeleted:{ type: Boolean, default: false },
    accountType: { type: String, enum: [accountType.CUSTOMER, accountType.BUSSINESSUSER, accountType.SUPERADMIN], default: accountType.CUSTOMER },
    status: { type: String, enum: [status.active, status.inactive], default: status.active },
    isSocialLogin: { type: Boolean, default: false },
    socialId: {
        type: String, required: function () {
            return (this.isSocialLogin == true) ? true : false
        }
    },
    savelist: [{
        businessid: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    wanttogolist: [
        {
            businessid: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    visitedlist: [{
        businessid: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
    blockedList: [{ type: mongoose.Schema.Types.ObjectId, ref: schmaName.users }],
    reporteduser: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
        by: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
        reason: {
            type: String
        }
    }],
    suggestion: [{
        by: { type: mongoose.Types.ObjectId, ref: schmaName.users },
        data: {
            type: String
        }
    }]
});
User = module.exports = mongoose.model(schmaName.users, userSchema)