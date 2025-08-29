/**here I create an blacklists model when the uer is logged out from the system, then that refresh token is saved in blacklists model */
const mongoose = require('mongoose');
const blacklistSchema = mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:'2M'
    }
},{versionKey:false, timestamps:true});
const blacklistsModel = mongoose.model("blacklistsModel", blacklistSchema, 'blacklists');
module.exports = blacklistsModel;
console.log('The black lists model is ready to use..')