const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");

const addToCart = async(req,res)=>{
    try {
        const {user_id,product_id,quantity} = req.body;
        console.log(`The user-id : ${user_id} and product-id: ${product_id} and quantity:${quantity}`);
        if(!mongoose.isValidObjectId(user_id)){
            return res.status(500).json({success:false,message:'Invalid Object ID..'})
        }
        if(!mongoose.isValidObjectId(product_id)){
            return res.status(500).json({success:false,message:'Invalid Object ID..'})
        }
        let product = await productModel.findById(product_id);
        console.log(`The product : ${product}`);
        if(!product){
            return res.status(500).json({success:false,message:'The product is not valid..'})
        }
        let requestedQuantity = Number(quantity);
        let availableStock = Number(product.stock);
        if(availableStock < requestedQuantity){
            return res.status(500).json({success:false,message:`Insufficient Stock. Only ${availableStock || 0} is available`})
        }
        console.log(`The user-id is : ${user_id}`)
        let cart = await orderModel.findOne({user_id});
        console.log('The cart :', cart);
        if(!cart){
            cart = new orderModel({
                user_id,
                items:[product_id,{quantity:requestedQuantity}]
            });
            console.log('The cart details :', cart);
        }else{
            let existingItemIndex = await cart.items.findIndex(item=>item.product_id.equals(product_id));
            if(existingItemIndex !== -1){
                cart.items[existingItemIndex].quantity += requestedQuantity;
            }else{
                cart.items.push({product_id,quantity:requestedQuantity})
            }
        }
        await cart.save();
        product.stock -= requestedQuantity;
        await product.save();
        return res.status(200).json({success:true,info:cart,message:'The product is added to the cart.'})
    } catch (error) {
        console.error('Error during the add to the cart:', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
const getCartByUser = async(req,res)=>{
    try {
        const userId = req.params.userId;
        console.log('The user-id is :', userId);
        let cartDetails = await orderModel.findOne({user_id:userId});
        console.log('The cart details based on the user :', cartDetails);
        if(!cartDetails){
            return res.status(500).json({success:false,message:'The cart details are not found..'})
        }
        return res.status(200).json({success:true,info:cartDetails,message:'The cart details'})
    } catch (error) {
        console.error('Error during the get cart info :', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
const billInfo = async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.cartId)){
            return res.status(500).json({success:false,message:'Invalid Object ID.'})
        }
        let orderInfo = await orderModel.findById({_id:req.params.cartId}).populate("items.product_id");
        console.log('The order details :', orderInfo);
        let totalBill = await orderInfo.items.reduce((total,item)=>{
            return total + (item.product_id.price * item.quantity)
        },0);
        console.log('The total bill is :', totalBill);
        return res.status(200).json({success:true,info:totalBill,message:'The total bill'})
    } catch (error) {
        console.error('Error during the bill-info:', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
module.exports = {addToCart,getCartByUser,billInfo}
console.log('The order controller is ready to use..')