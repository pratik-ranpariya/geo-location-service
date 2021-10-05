const code = require('../constants').http_codes;
const msg = require('../constants').messages;

function responseerror(req,res,next,err){
   res.json({ code:code.internalError, message: msg.internalServerError })

}
module.exports={
    responseerror
}