const multer = require("multer");
const uploadObj = require("../file/file.upload");
const productModel = require("../models/product.model");
const fs = require('fs');
const path = require('path');
const { error } = require("console");
const {  default: mongoose } = require("mongoose");
const deleteFile = function (filename){
    const actualFileName = path.basename(filename);
    console.log(`The actual filename : ${actualFileName}`);
    const pathFile = path.join(__dirname,'../public/products',actualFileName);
    console.log('The path filename is :', pathFile);
    return new Promise((resolve, reject) => {
        if(fs.existsSync(pathFile)){
            fs.unlink(pathFile,(error)=>{
                if(error){
                    reject(error);
                }else{
                    console.log(`The ${filename} is deleted successfully..`);
                    resolve();
                }
            })
        }else{
            console.log(`${filename} is not deleted successfully..`);
            resolve();
        }
    })
    
}
/**add the new product */
const addNewProduct = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The product is new added'})
    try {
        let upload = uploadObj.single('image');
        upload(req,res,async function(error){
            if(error instanceof multer.MulterError){
                return res.status(500).json({Error:error})
            }else if(error){
                return res.status(500).json({Error:error,message:'Only *jpg,*jpeg,*png file will upload..'})
            }
            const {product,description,price,stock} = req.body;
            if(!req.body || !req.body.product || !req.body.description || !req.body.price || !req.file || !req.body.stock){
                const missingFields = !product ? "product" : !description ? "description" : !price ? "price" : !req.file ? "image" : !stock ? "stock" : '';
                console.log('The missing fields :', missingFields);
                return res.status(500).json({success:false,message:`The missing fields : ${missingFields}`})
            }
            const newFood = await productModel.create({
                product,
                description,
                price,
                image:`${process.env.BASE_URL}/products/${req.file.filename}`,
                stock
            });
            if(newFood){
                return res.status(200).json({success:true,message:'The new product is inserted..'})
            }else{
                return res.status(500).json({success:false,message:'This product data is not valid..'})
            }
        })
    } catch (error) {
        console.error('Error during the product update ', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
/**all the product lists */
const allProductLists = async(req,res)=>{
    try {
        let productLists = await productModel.find().exec();
        if(productLists){
            return res.status(200).json({success:true,info:productLists,message:'All the products are displayed..'})
        }
    } catch (error) {
        console.error('Error during the product lists display:', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
/**delete the product */
const deleteProduct = async(req,res)=>{
    // return res.status(200).json({success:true,message:'The product is deleted..'})
    try {
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id)){
            return res.status(500).json({success:false,message:'Invalid Object ID..'})
        }
        const productId = await productModel.findById(id);
        if(!productId){
            return res.status(401).json({success:false,message:'The product id is not found..'})
           }
           console.log('The deleted product id is : ', productId);
       await productModel.findByIdAndDelete(id);
       await deleteFile(productId.image);
        return res.status(200).json({success:true,info:productId,message:'The product is deleted..'})
    } catch (error) {
        console.error('Error during the delete the product:', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
/**update the product */
const productUpdate = async(req,res)=>{
    try {
        if(req.method === 'PUT' || req.method === 'PATCH'){
            let upload = uploadObj.single('image');
            upload(req,res,async function(error){
                if(error instanceof multer.MulterError){
                    return res.status(500).json({Error:error})
                }else if(error){
                    return res.status(500).json({Error:error,message:'Only *jpg,*jpeg,*png file format will upload'})
                }
                let existingProductId = await productModel.findById(req.params.id);
                console.log('The existing product name is :', existingProductId);
                const {product,description,price,stock} = req.body;
                let updateData = {...req.body};
                if(req.file && req.file.filename){
                    updateData.image = `${process.env.BASE_URL}/products/${req.file.filename}`,{new:true}
                }
                let changes = Object.keys(updateData).some(
                    key => updateData[key] !== existingProductId[key]
                );
                console.log('The changes are coming :', changes);
                if(!changes){
                    return res.status(200).json({success:true,message:'The product details are remains same..'})
                }
                let updateProductDetails = await productModel.findByIdAndUpdate(req.params.id,updateData,{new:true});
                console.log('The product details are updated :', updateProductDetails);
                if(!updateProductDetails){
                    return res.status(500).json({success:false,message:"The product data is not updated.."})
                }
                const message = req.file && req.file.filename ? "The product image is updated" : "Only The product details are updated.";
                return res.status(200).json({success:true,message,info:updateProductDetails})
            })
        }else{
            return res.status(500).json({success:false,message:`${req.method} is not supported..`})
        }
    } catch (error) {
        console.error('Error during the update product:', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
module.exports = {addNewProduct,allProductLists, deleteProduct,productUpdate};
console.log('The product controller is ready to use..')