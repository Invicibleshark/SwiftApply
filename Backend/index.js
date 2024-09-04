const express = require("express");
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const authUser = require("./Routes/AuthRouter")
const applyIntern = require("./Routes/InternRouter");
require('dotenv').config();
require('./Models/db')
const PORT = process.env.PORT||8080;

app.get("/",(req,res)=>{
    res.send("Hello Jee");
})
//MiddleWare
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

app.use("/auth",authUser);
app.use("/apply", applyIntern);
app.listen(PORT,()=>
    {console.log(`Listening at ${PORT}`)
});