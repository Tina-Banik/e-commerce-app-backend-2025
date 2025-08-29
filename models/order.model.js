const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    order_date:{
        type:Date,
        default:Date.now()
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        require:true
    },
    items:[{
        _id:false,
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"productModel",
            require:true
        },
        quantity:{
            type:Number,
            require:true,
            min:1 /**min 1 should be added.. */
        }
    }]
},{versionKey:false,timestamps:true});
const orderModel = mongoose.model("orderModel",orderSchema,"order");
module.exports = orderModel;
console.log('The order model is ready to use..');