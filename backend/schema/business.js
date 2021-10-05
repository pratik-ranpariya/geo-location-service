const mongoose = require('mongoose');
const schema = mongoose.Schema;
const schemaName = require('../constants').schemas;
const bussinessCategories = require('../constants').bussinessCategories;
const businessType = require('../constants').businessType;
const status = require('../constants').status;

var businessSchema = new schema({
    typeOfBusiness: { type: String, enum: [businessType.online, businessType.brickandmortar] },
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: [status.active, status.inactive], default: status.inactive },
    approve: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // category: { type: String, required: true },//, enum: [bussinessCategories.health, bussinessCategories.homeservices, bussinessCategories.beautysalon, bussinessCategories.cookouts, bussinessCategories.retail] },
    category: { type: mongoose.Types.ObjectId, ref: schemaName.category },
    description: { type: String, required: true },
    contactNo: { type: String, required: true },
    businessHours: { type: String },
    address: { type: String, required: true },
    website: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [  ,<longitude>, <latitude> ]
    },
    zipcode: { type: String },
    openTime: { type: String },
    closeTime: { type: String },
    availablity: [{
        day: { type: String, required: true },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
        status: { type: String, enum: [status.open, status.close], default: status.open }

    }],
    photos: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: schemaName.users },
    businessActivateToken: {
        type: String
    },

    businessActivateExpires: {
        type: Date
    },
    usersaved: [{
        userId: { type: mongoose.Types.ObjectId, ref: schemaName.users },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    uservisited: [{
        userId: { type: mongoose.Types.ObjectId, ref: schemaName.users },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    userwanttogo: [{
        userId: { type: mongoose.Types.ObjectId, ref: schemaName.users },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    // suggestion: [{
    //     by: { type: mongoose.Types.ObjectId, ref: schemaName.users },
    //     data: {
    //         type: String
    //     }
    // }]
});

User = module.exports = mongoose.model(schemaName.bussiness, businessSchema)
createAscendingIndex
var createAscendingIndex = function (db, callback) {
    // Get the users collection
    var collection = db.collection(schemaName.bussiness);
    collection.createIndex(
        { content: "text" },
        { default_language: "german" }
    );
};