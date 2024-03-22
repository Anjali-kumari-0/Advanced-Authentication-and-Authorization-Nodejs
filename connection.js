// async function connection(url){
//     return mongoose.connect(url).then(()=>{
//         console.log("database connected")
//     }).catch(()=>{
//         console.log("somthing wrong with database connection:: ", err)
//     })
// }
// exports.module=connection
const mongoose = require("mongoose");

async function connection(url) {
    try {
        await mongoose.connect(url);
        console.log("Database connected");
    } catch (err) {
        console.log("Something went wrong with database connection:", err);
    }
}

module.exports = connection;
