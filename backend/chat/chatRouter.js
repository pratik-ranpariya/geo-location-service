const chatRouter = require('express').Router();
const actions = require('./chatAction');
const { chat } = require('googleapis/build/src/apis/chat');
const service = require('../chat/chatService')


chatRouter.route('/chatlist')//list of paricular sender receiver chat unread count and detailed chatshould unique it with name of sender receiver for listing page
    .get([], (req, res, next) => {
        actions.chatlist(req, res, next)
    });
//update read chat
chatRouter.route('/update')//should unique it with name of sender receiver for read unread
    .put([], (req, res, next) => {
        actions.chatUpdate(req, res, next)
    });


//should unique it with name of sender receiver for listing page
chatRouter.route('/chatwithunread')
    .get([], (req, res, next) => {
        actions.chatwithUnread(req, res, next)
    });
chatRouter.route('/test').get([], (req, res) => {
    service.test(req, res)
})
module.exports = chatRouter;