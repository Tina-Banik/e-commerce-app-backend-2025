/**here we create a user model where the user must follow this  */
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:[true,'Please enter the username']
    },
    email:{
        type:String,
        require:[true,'Please enter the email']
    },
    password:{
        type:String,
        require:[true,'Please enter the password']
    },
    refreshToken:{
        type:String
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
},{versionKey:false, timestamps:true});
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}
const userModel = mongoose.model("userModel",userSchema,"users");
module.exports = userModel;
console.log('The user model is ready to use..');