/**here I write the code for verifying the refresh and access token token */
const jwt = require('jsonwebtoken');
const verify_accessToken = async(req,res,next)=>{
    console.log('Executing the verify access token..');
    console.log('The req.headers for verifying the access token :', req.headers);
    console.log('The req.cookies for verifying the access token :', req.cookies);
    try {
    const access_key = process.env.ACCESS_KEY;
    console.log('The access key that presents in the .env file ', access_key);
        if(!access_key){
            return res.status(401).json({success:false,message:"The access key is not defined"})
        }
        const access_token = req.headers._accesstoken || req?.cookies.accessToken;
        console.log('For verifying the access token :', access_token);
        if(!access_token){
            return res.status(500).json({success:false,message:'The auth header is missing..'})
        }
        const decodedToken = jwt.verify(access_token,access_key);
        console.log('The decoded token after verifying the access token :', decodedToken);
        req.decode = decodedToken;
        console.log('The req.decode during the verify the access token:', req.decode);
        next();
    }
     catch (error) {
        console.error('Error during the verifying the access token :', error.name);
        if(error.name == 'TokenExpiredError'){
            return res.status(500).json({success:false,message:'You have logged out.'})
        }
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
const verify_refreshToken = async(req,res,next)=>{
    console.log('Verifying the refresh token..');
    console.log('The refresh token that comes form the headers:', req.headers);
    console.log('The refresh token that comes from the cookies also:', req.cookies);
    try {
        const refresh_key = process.env.REFRESH_KEY;
        if(refresh_key){
            const refresh_token = req.headers._refreshtoken || req.cookies.refreshToken;
            console.log('The refresh token that comes from the header:', refresh_token);
            if(!refresh_token){
                return res.status(500).json({success:false,message:'The auth header is missing..'})
            }
            const decodedToken = jwt.verify(refresh_token,refresh_key);
            console.log('The decoded token after verifying the refresh token:', decodedToken);
            req.decode = decodedToken;
            console.log('The req.decode during the verifying the refresh token:', req.decode);
            next();
        }
    } catch (error) {
        console.error('Error during verifying the refresh token:', error.message);
        if(error.name == 'TokenExpiredError'){
            return res.status(500).json({success:false,message:'The jwt is Expired....'})
        }
        return res.status(500).json({success:true,message:'Internal server error..'})
    }
}
module.exports = {verify_accessToken,verify_refreshToken};
console.log('Verify the refresh token is ready to use..')
// const access_token = req.headers._accesstoken || req.cookies.accessToken;
// Means: If req.headers._accesstoken exists (i.e., is truthy), assign its value to access_token. If it doesn't exist or is falsy, fall back to req.cookies.accessToken.

// This is the correct approach in scenarios where the token can come from either headers or cookies. You're giving preference to _accesstoken from the headers, and if it's not available, you're using the accessToken from the cookies.
// const access_token = req.headers._accesstoken && req.cookies.accessToken;
// This means: access_token will only be assigned req.cookies.accessToken if both req.headers._accesstoken and req.cookies.accessToken are truthy. This is not what you want because it requires both sources to be present at the same time, which defeats the purpose of allowing the token to come from either one.