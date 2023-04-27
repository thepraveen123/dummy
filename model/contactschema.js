const mongoose = require('mongoose')
var url ='mongodb+srv://praveenkumaar715:praveen123@cluster0.p9f3rra.mongodb.net/Jewellery?retryWrites=true&w=majority'

mongoose.connect(url,{
    UseNewUrlParser:true,
    UseUnifiedTopology:true
})

const usercontact =  mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
})

const contactmodel= mongoose.model("contactuser",usercontact)
module.exports = contactmodel