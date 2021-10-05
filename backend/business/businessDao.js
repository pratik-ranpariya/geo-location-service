let BaseDao = require('../dao/baseDao');
const businessModel = require('../schema/business')
const bussinessDao = new BaseDao(businessModel);

function create(data) {
    return bussinessDao.save(data).then((result) => {
        return result;
    })
}

function findone(query){
    return bussinessDao.findOne(query,).then((result)=>{
        return result; 
    })
}
function find(query){
    return bussinessDao.find(query).then((result)=>{
        return result; 
    })
}
function findOneAndUpdate(query,update,options){
    return bussinessDao.findOneAndUpdate(query,update,options).then((result)=>{
        return result; 
    })
}
function remove(query){
    return bussinessDao.remove(query,).then((result)=>{
        return result; 
    })
}
module.exports = {
    create,
    findone,
    findOneAndUpdate,
    find,
    remove
}