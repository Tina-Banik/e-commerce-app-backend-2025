/**here I create a product model that when the product is stored then it follows this criteria */
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    product:{
        type:String,
        require:[true,'Please enter the product name']
    },
    description:{
        type:String,
        require:[true,'Please enter the product description']
    },
    price:{
        type:Number,
        require:[true,'Please enter the product price'],
        min:0
    },
    image:{
        type:String,
        require:[true,'Please enter the product image']
    },
    stock:{
        type:Number,
        require:[true,'Please enter the product stock'],
        min:0
    }
},{versionKey:false,timestamps:true});
const productModel = mongoose.model("productModel", productSchema, "products");
module.exports = productModel;
console.log('The product model is ready to use.');