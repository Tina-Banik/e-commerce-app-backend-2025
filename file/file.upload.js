const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/products');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
});
const uploadObj = multer({
    limits:{
        fileSize: 100000
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/png'){
           cb(null,true);
        }else{
            cb(null,new Error("Only *jpg and *jpeg and *png file format will be uploaded.."))
        }
    },
    storage:fileStorage
});
module.exports = uploadObj;
console.log('The upload file is ready to use..');