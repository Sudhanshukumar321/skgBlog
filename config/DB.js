const mongoose = require("mongoose")
require('dotenv').config();

exports.Connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }).then(()=>{console.log(`DB Connected Successfully`);})
    .catch((err)=>{
        console.log(`Error During DB Connection`);
        console.log(err);
        process.exit(1);
    })
}; 