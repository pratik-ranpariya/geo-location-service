let BaseDao = require('../dao/baseDao');
const chatModel = require('../schema/chat')
const customerDao = new BaseDao(chatModel);

function create(data) {
    return customerDao.save(data).then((result) => {
        return result;
    })
}

function find(query){
    return customerDao.find(query,).limit(10).then((result)=>{
        return result; 
    })
}
function findOneAndUpdate(query,update,options){
    return customerDao.findOneAndUpdate(query,update,options).then((result)=>{
        return result; 
    })
}
module.exports = {
    create,
    find,
    findOneAndUpdate
}