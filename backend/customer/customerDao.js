let BaseDao = require('../dao/baseDao');
const userModel = require('../schema/user')
const customerDao = new BaseDao(userModel);

function createuser(data) {
    return customerDao.save(data).then((result) => {
        return result;
    })
}

function finduser(query){
    return customerDao.findOne(query,).then((result)=>{
        return result; 
    })
}
function find(query){
    return customerDao.find(query,).then((result)=>{
        return result; 
    })
}
function findOneAndUpdate(query,update,options){
    return customerDao.findOneAndUpdate(query,update,options).then((result)=>{
        return result; 
    })
}
function remove(query){
    return customerDao.remove(query).then((result)=>{
        return result; 
    })
}
module.exports = {
    createuser,
    find,
    finduser,
    findOneAndUpdate,
    remove
}