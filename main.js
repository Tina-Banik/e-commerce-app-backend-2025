const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(require('cors')({origin: process.env.PROCESS_ALLOWED_ORIGIN, credentials:true}));
/**require the database connection */
require('./db/db.connections');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
 // Serve static files from the 'public/products' directory
// app.use('/products', express.static('public/products'));

/**cookies consume */
/**consume the user route */
const userPath = '/user';
const userRoute =require('./routes/user.route');
app.use(`${process.env.API_URL}${userPath}`,userRoute);
/**consume the product route */
const productPath = '/products';
const productRoute = require('./routes/product.route');
app.use(`${process.env.API_URL}${productPath}`,productRoute);
/**consume the order route */
const orderPath = '/order';
const orderRoute = require('./routes/order.route');
app.use(`${process.env.API_URL}${orderPath}`,orderRoute);
app.get('/',(req,res)=>{
    res.send("<h4 class='text-center' style='color:red'>Welcome to the E-commerce site-2025</h4>")
})
app.listen(process.env.PORT,()=>{
    console.log(`The server listens at ${process.env.PORT}`)
})