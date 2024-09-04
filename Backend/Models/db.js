const mongoose = require("mongoose")
const mongo_url = process.env.MONGODB_URL;
mongoose.connect(mongo_url)
.then(()=>{
    console.log("Mongodb Connected !!");
})
.catch((req,res,err)=>{
    console.log("DB Connection Error");
})