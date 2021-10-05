const util = require('../app util/util');
const code = require('../constants').http_codes;
const msg = require('../constants').messages;
const status = require('../constants').status;
const role = require('../constants').roles;
const chatdao = require('./chatDao')
const chat = require('../schema/chat')
// const customerdao = require('.');
// const businessdao = require('../business/businessDao');
ObjectId = require('mongodb').ObjectID;
// const socketfunc = require('../socket/socketHandler')

function chatlist(req, res) {
    const { senderId, receiverId, businessSenderId, businessReceiverId } = req.query;
    let query = {
        "senderId": { $in: [senderId, receiverId] }, "receiverId": { $in: [senderId, receiverId] },
        "businessReceiverId": { $in: [businessSenderId, businessReceiverId] },
        "businessSenderId": { $in: [businessSenderId, businessReceiverId] }
    }
    chat.find(query).populate('senderId', 'name').populate('receiverId', 'name')
        .populate('businessSenderId', 'name').populate('businessReceiverId', '_id name').then((result) => {
            res.json({ code: code.ok, data: result, unread: msg.length })
            // let query = { "receiverId": senderId, "status": status.unread }
            // chatdao.find(query).then((msg) => {
            // })
        }).catch((err) => {
            console.log("chatlist -> err", err)
            res.json({ code: code.ineternalError, message: msg.internalServerError })

        })
    //count of unread in which senderId here is receiverId in record
}
function chatUpdate(req, res) {
    if (req.body.senderId) {
        var query = { businessReceiverId: req.query.id, senderId: req.query.senderId };
    } if (req.body.businessSenderId) {
        var query = { receiverId: req.query.id, businessSenderId: req.query.businessSenderId };
    }
    // let query = { receiverId: req.query.id, senderId: req.query.senderId };
    chatdao.find(query).then((result) => {
        result.map((msg) => {
            let query = { _id: msg._id },
                update = { status: status.read },
                options = { new: true }
            chatdao.findOneAndUpdate(query, update, options).then((data) => {
                console.log("chatUpdate -> data", data)
            
            })
        })
    }).catch((err) => {
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
async function chatwithUnread(req, res) {
    const { id } = req.query;
    let query = { $or: [{ "senderId": id }, { "receiverId": id }] }
    var chatlistunique = []
    // console.log("chatwithUnread -> query", query)
    await chat.find(query).populate('senderId', 'name').populate('receiverId', 'name').then(async (result) => {
        console.log("chatwithUnread -> result", result)
        const final = await result.map(async (msg) => {
            console.log("chatwithUnread -> msg", msg.messages)

            var obj = {
                senderId: {
                    id: msg.senderId._id,
                    name: msg.senderId.name
                },
                receiverId: {
                    id: msg.receiverId._id,
                    name: msg.receiverId.name
                },
                message: {
                    msg: msg.messages,
                    timestamp: msg.timestamp
                },
                isBlock: msg.isBlock
            }
            if (chatlistunique.length == 0) {
                chatlistunique.push(obj)
                // console.log("chatwithUnread -> chatlistunique", chatlistunique)
            }
            else if (chatlistunique.length != 0) {

                chatlistunique.map((ele) => {
                    console.log("chatwithUnread -> ele", ele)
                    if (((ele.senderId.id == obj.senderId.id) && (ele.receiverId.id == obj.receiverId.id)) ||
                        ((ele.senderId.id == obj.receiverId.id) && (ele.receiverId.id == obj.senderId.id))) {

                        ele.message = obj.message;
                        ele.isBlock = obj.isBlock;
                        // console.log("chatwithUnread -> ele", ele)
                    } else if (ele.senderId.id != false && ele.senderId.id != true) {
                        chatlistunique.push(obj)
                        // console.log("chatwithUnread -> chatlistunique", chatlistunique)
                    }

                })

            }
            return chatlistunique;
        })
        console.log("chatwithUnread -> final", JSON.stringify(final))



    }).catch((err) => {
        console.log("chatwithUnread -> err", err)
        res.json({ code: code.ineternalError, message: msg.internalServerError })

    })
}
function unread(chatlistunique, id, res) {
    chatlistunique.map((ele, index) => {
        let query = { receiverId: id, status: status.unread }
        chat.find(query).then((result) => {
            console.log("unread -> result", result.length)
            ele.unread = result.length;
            console.log("unread -> ele", ele)
            // if ((index + 1) == chatlistunique.length) {
            //     res.json({ code: code.ok, data: chatlistunique })
            // }
        }).catch((err) => {
            res.json({ code: code.ineternalError, message: msg.internalServerError })

        })
    })
}
function test(req,res){
    // socket.emit("uniquechat","5fa1032859cee83aed6548e1")
    // socketfunc.uniquedata("5fa1032859cee83aed6548e1")
    // socketfunc.uniquedata("5fa1032859cee83aed6548e1")
}
module.exports = {
    // add,
    chatlist,
    chatUpdate,
    chatwithUnread,
    test

}