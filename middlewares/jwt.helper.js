/**here we create an access and refresh token */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/user.model');
/**using the crypto we can create a access and refresh token */
function generateRandomToken(length){
    return crypto.randomBytes(length).toString('hex');
}
/**create an access token */
const access_key = process.env.ACCESS_KEY || generateRandomToken(32);
const create_accessToken = async(id,email,role)=>{
    console.log('The access key that presents in the .env file:', access_key);
    if(access_key){
         const access_token = jwt.sign({_id:id,email:email,role:role === 'admin' ? 'admin' : 'user'},access_key,{expiresIn:process.env.ACCESS_KEY_EXPIRY});
        return access_token;
    }
};
/**create the refresh token */
const refresh_key = process.env.REFRESH_KEY || generateRandomToken(64);
const create_refreshToken = async(id,email)=>{
    console.log('The refresh key that presents in the .env file :', refresh_key);
    if(refresh_key){
        const refresh_token = await jwt.sign({_id:id,email:email},refresh_key,{expiresIn:process.env.REFRESH_KEY_EXPIRY});
        await userModel.findByIdAndUpdate(id,{refreshToken:refresh_token});
        return refresh_token;
    }
}
module.exports = {create_accessToken, create_refreshToken};
console.log('Create an access and refresh token is ready to use..')