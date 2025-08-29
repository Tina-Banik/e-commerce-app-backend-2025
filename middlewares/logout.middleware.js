/**here I write the code for validate the refresh token when the user is logged out from the system*/
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const validateToken = async(req,res,next)=>{
    console.log('Executing the validate the token..');
    console.log('The req.headers for the logout middleware : ', req.headers);
    console.log('The req.cookies for the logout middleware :', req.cookies);
    console.log("The req.header('Authorization') :", req.header('Authorization'));
    try {
        const authHeader = req.cookies?.refreshToken ||( req.header('Authorization') && req.header('Authorization').replace("Bearer ",""));
        // const authHeader = req.cookies.refreshToken || req.header("Authorization").replace("Bearer ","");
        console.log('The refresh token in that is in logout :', authHeader);
        if(!authHeader){
            return res.status(500).json({success:false,message:'The auth header is missing..'})
        }
        const decodedToken = jwt.verify(authHeader,process.env.REFRESH_KEY);
        console.log('The decoded token during the validate the token :', decodedToken);
        const logoutUser = await userModel.findById(decodedToken._id);
        console.log('The logout user info :', logoutUser);
        req.user = logoutUser; 
        console.log('the req.user after verifying the validate the refresh token :', req.user);
        next();
    } catch (error) {
        console.error('Error during the validate the refresh token :', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
module.exports = {validateToken};
console.log('The validate token is ready to use..');