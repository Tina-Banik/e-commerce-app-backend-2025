const { create_accessToken, create_refreshToken } = require("../middlewares/jwt.helper");
const blacklistsModel = require("../models/blacklists.model");
const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs')
/**register the user */
const register = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The user is registered..'})
    try {
        const {username,email,password,role} = req.body;
        console.log(`The username ${username} and ${email} and ${password} and ${role}`);
        if(!req.body || !req.body.username || !req.body.email || !req.body.password || !req.body.role){
            const missingFields = !username ? "username" : !email ? "email" : !password ? "password" : !role ? "role" : '';
            console.log(`The missing fields : ${missingFields}`);
            return res.status(500).json({success:false,message:`the missing fields : ${missingFields}`})
        }
        const userExists = await userModel.findOne({email});
        console.log(`The user exists name is : ${userExists}`);
        if(userExists){
            return res.status(401).json({success:true,message:'The user is already registered with us'})
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password,salt);
        const newUser = await userModel.create({
            username,
            email,
            password:hashPass,
            role
        });
        console.log(`The new user is : ${newUser}`);
        if(newUser){
            return res.status(200).json({success:true,message:'You are registered with us..'})
        }else{
            return res.status(500).json({success:false,message:'The user data is not valid..'})
        }
    } catch (error) {
        console.error('Error during the registration..', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
/**user login */
const login = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The user is logged in'})
    try {
        const {username,email,password} = req.body;
        console.log(`The username ${username} and ${email} and ${password}`);
        if(!(username || email)){
            return res.status(200).json({success:true,message:'The username or email is required'})
        }
        const validUser = await userModel.findOne({
            $or:[{username},{email}]
        });
        console.log(`The valid user is : ${validUser}`);
        console.log(`The valid user password: ${validUser.password}`);
        if(!password){
            return res.status(500).json({success:false,message:'The password is required..'})
        }
        const isValidPassword = await validUser.isPasswordCorrect(password);
        console.log('The password is correct:', isValidPassword);
        if(!isValidPassword){
            return res.status(401).json({success:false,message:'Invalid User Credentials..'})
        }
        const loggedUser = await userModel.findById(validUser._id);
        console.log('The logged User info :', loggedUser);
        const accessToken = await create_accessToken(loggedUser._id,loggedUser.email,loggedUser.role);
        console.log('The access token while the user login to the system:', accessToken);
        const refreshToken = await create_refreshToken(loggedUser._id,loggedUser.email);
        console.log('The refresh token while the user login to the system:', refreshToken);
        const options = {
            httpOnly:true,
            secure:true,
            maxAge:20*1000
        }
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,maxAge:2*60*1000}).json({success:true,info:loggedUser.email,role:loggedUser.role,_accessToken:accessToken,_refreshToken:refreshToken,message:`${loggedUser.username} is logged in successfully..`})
    } catch (error) {;
        console.error('Error during the login-info:', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
/**refresh the access token */
const refreshAccessToken = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The access token is refreshed successfully..'});
    try {
        const loginInfo = await userModel.findOne({email:req.decode.email});
        console.log('The valid login info when the the user logged into the system after verifying the access token:',loginInfo);
        return res.status(200).json({
            email:loginInfo.email,
            _refreshAccessToken: await create_accessToken(loginInfo._id,loginInfo.email,loginInfo.role),
            message:'The access token is refreshed successfully..'
        })
    } catch (error) {
        console.error('Error during the refresh the access token:', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
/**user logout */
const logout = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The user is logged out..'})
    try {
        console.log('The req.user in logout middleware :', req.user);
        const savedBlacklistToken = await blacklistsModel.create({token:req.user.refreshToken});
        console.log('The saved blacklists token :', savedBlacklistToken);
        await userModel.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:null}});
        return res.status(200).clearCookie("accessToken",{httpOnly:true,secure:true}).clearCookie("refreshToken",{httpOnly:true,secure:true}).json({success:true,message:`${req.user.username} is logged out successfully..`})
    } catch (error) {
        console.error('Error during the logout:', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
/**user new password */
const changePassword = async(req,res)=>{
    try {
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword) {
            return res.status(500).json({success:false,message:'The old password is required..'})
        }
        const user = await userModel.findById(req.decode._id);
        console.log('The user info for changing the passwords :', user);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        console.log('The Old password:',isPasswordCorrect);
        if(!isPasswordCorrect){
            return res.status(500).json({success:false,message:'The old password does not match.'})
        }
        if(!newPassword){
            return res.status(500).json({success:false,message:'The new password is required..'})
        }
        if(typeof newPassword !== 'string' &&  newPassword.trim() === ''){
            return res.status(500).json({success:false,message:'The new password can not be blank..'})
        }
        user.password = await bcrypt.hash(newPassword,10);
        await user.save({validateBeforeSave:false});
        console.log('The new password is set.');
        return res.status(200).json({success:true,message:'The new password is set. You can login with the new password'})
    } catch (error) {
        console.error('Error during the change the password :', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
/**get the information */
const getInformation = (req,res)=>{
    return res.status(200).json({success:true,info:req.decode._id,message:'The user information'})
}
/**update the user profile */
const updateInfo = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The user details are updated..'})
    try {
        if(req.method === 'PUT' || req.method === 'PATCH'){
            console.log('The req.decode for verifying the user :', req.decode._id);
            if(req.decode._id !== req.params.id){
                return res.status(500).json({success:false,message:'The user is not authorized for updating the user..'})
            }
            const existingUserId = await userModel.findById({_id:req.decode._id});
            console.log('The existing user id :', existingUserId);
            if(!existingUserId){
                return res.status(500).json({success:false,message:'The user is not existed..'})
            }
            const {username,email} = req.body;
            console.log(`The username :${username} and email :${email}`)
            let updateData = {...req.body};
            let changes = Object.keys(updateData).some(
                key => updateData[key]  != existingUserId[key]
            );
            console.log('The changes are coming :', changes);
            if(!changes){
                return res.status(200).json({success:true,message:'The user data remains same as you did not update anything..'})
            }
            let updateUserDetails = await userModel.findByIdAndUpdate({_id:req.decode._id},updateData,{new:true});
            console.log('The update user details :', updateUserDetails);
            if(!updateUserDetails){
                return res.status(500).json({success:false,message:'User details are not updated..'})
            }
            return res.status(200).json({success:true,info:updateUserDetails,message:'Account details are updated..'})
        }else{
            return res.status(500).json({success:false,message:`${req.method} is not supported..`})
        }
    } catch (error) {
        console.error('Error during the update info :', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
module.exports = {register,login,refreshAccessToken,logout,changePassword,getInformation,updateInfo};
console.log('The user controller is ready to use..')