const blacklistsModel = require("../models/blacklists.model");

/**here I write the code for blacklists the refresh token, when the user is logged out from the system that refresh token is saved in the blacklists model */
const checkBlackLists = async(req,res,next)=>{
    console.log('Executing the check blacklists..');
    console.log('Executing the req.headers in check-blacklists :', req.headers);
    console.log('Executing the req.cookies in check-blacklists :', req.cookies);
    try {
        const authHeader = req.headers._refreshtoken || req.cookies.refreshToken ;
        console.log('The auth header that comes from the headers during the check-blacklists:', authHeader);
        if(!authHeader){
            return res.status(500).json({success:false,message:'The auth header is missing..'})
        }
        const blacklistToken = await blacklistsModel.findOne({token:authHeader});
        console.log('The saved blacklists token in the blacklists model:', blacklistToken);
        if(blacklistToken){
            return res.status(200).json({success:true,message:'The token is already blacklisted. Login again tto visit the all path'})
        }
        next();
    } catch (error) {
        console.error('Error during the blacklists middleware :', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
module.exports = {checkBlackLists};
console.log('The check blacklists is ready to use..');