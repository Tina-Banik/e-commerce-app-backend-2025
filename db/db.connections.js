const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
const database_connection = mongoose.connect(`${process.env.MONGODB_URL}`)
.then(()=>{
    console.log("Database connection is ready to use..")
})
.catch((error)=>{
    console.error("Error during the database connection", error);
})
module.exports = database_connection;
console.log("The database string is ready to use..");