const service = require('./chatService')

function chatlist(req, res, next) {
    service.chatlist(req, res, next)
}
function chatUpdate(req, res, next) {
    service.chatUpdate(req, res, next)
}
function chatwithUnread(req, res, next) {
    service.chatwithUnread(req, res, next)
}
module.exports = {
    chatlist,
    chatUpdate,
    chatwithUnread

}