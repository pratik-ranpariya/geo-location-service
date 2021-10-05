const service = require('./customerService')


function signup(req, res, next) {
    service.createUser(req, res, next)

}

function login(req, res) {
    service.authenticateUser(req, res)
}
function addtosave(req, res) {
    service.addtosave1(req, res)
    // service.addtosave(req, res)
}

function removesave(req, res){
    service.removefromsave(req, res)
}

function addtowanttogo(req, res) {
    service.addtowanttogo1(req, res)
  

}
function removewanttogo(req, res){
    service.removefromwanttogo(req, res)
}
function addtovisited(req, res) {
    service.addtovisited1(req, res)
    // service.addtovisited(req, res)
}
function removevisited(req, res) {
    service.removefromvisited(req, res)
    // service.addtovisited(req, res)
}

function forgotPassword(req, res) {
    service.forgotPassword(req, res)
}


function changePassword(req, res) {
    service.changePassword(req, res)
}
function updateProfile(req, res) {
    service.updateProfile(req, res)
}
function getresetpassword(req, res) {
    service.getresetpassword(req, res)
}
function resetpassword(req, res) {
    service.resetpassword(req, res)
}
function listvisited(req, res) {
    service.listvisited(req, res)
}
function listwanttogo(req, res) {
    service.listwanttogo(req, res)
}
function listsaved(req, res) {
    service.listsaved(req, res)
}
function listusers(req, res) {
    service.listusers(req, res)
}
function userdetail(req, res) {
    service.userdetail(req, res)
}
function socialloginGmail(req, res) {
    service.socialloginGmail(req, res)
}
function socialloginFacebook(req, res) {
    service.socialloginFacebook(req, res)
}
function socialloginLinkedin(req, res) {
    service.socialloginLinkedin(req, res)
}
function blockUser(req, res) {
    service.blockUser(req, res)
}
function blockuserlist(req, res) {
    service.blockuserlist(req, res)
}
function reportUser(req, res) {
    service.reportUser(req, res)
}
function deleteAcc(req, res) {
    service.deleteAcc(req, res)
}
function addSuggestion(req, res,next) {
    service.addSuggestion(req, res,next)
}
module.exports = {
    signup,
    login,
    addtosave,
    addtowanttogo,
    addtovisited,
    forgotPassword,
    getresetpassword,
    resetpassword,
    listusers,
    changePassword,
    updateProfile,
    listvisited,
    listwanttogo,
    listsaved,
    userdetail,
    socialloginGmail,
    socialloginFacebook,
    socialloginLinkedin,
    blockUser,
    blockuserlist,
    reportUser,
    deleteAcc,
    addSuggestion,
    removesave,
    removevisited,
    removewanttogo
    
}