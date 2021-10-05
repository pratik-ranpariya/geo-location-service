const mongoose = require('mongoose');
const schema = mongoose.Schema;
const schmaName = require('../constants').schemas;

var chatSchema = new schema({
    // senderId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
    // receiverId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
    // roomId: { type: mongoose.Schema.Types.ObjectId, ref: "roomSchema" },
    // messages: { type: String },
    // timestamp: {
    //     type: Date,
    //     default: Date.now()
    // },
    status: { type: String, enum: [status.read, status.unread], default: status.unread },
    isBlock: { type: Boolean, default: false },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.users },
    businessSenderId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
    businessReceiverId: { type: mongoose.Schema.Types.ObjectId, ref: schmaName.bussiness },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "roomSchema" },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


User = module.exports = mongoose.model(schmaName.chat, chatSchema)