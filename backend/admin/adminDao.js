let BaseDao = require('../dao/baseDao');
const categoryModel = require('../schema/category')
const categoryDao = new BaseDao(categoryModel);

function create(data) {
    return categoryDao.save(data).then((result) => {
        return result;
    })
}

function find(query){
    return categoryDao.find(query,).then((result)=>{
        return result; 
    })
}
function findOneAndUpdate(query,update,options){
    return categoryDao.findOneAndUpdate(query,update,options).then((result)=>{
        return result; 
    })
}
function remove(query){
    return categoryDao.remove(query,).then((result)=>{
        return result; 
    })
}
module.exports = {
    create,
    find,
    findOneAndUpdate,
    remove
}