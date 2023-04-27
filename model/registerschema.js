const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
var url ='mongodb+srv://praveenkumaar715:praveen123@cluster0.p9f3rra.mongodb.net/Jewellery?retryWrites=true&w=majority'
mongoose.connect(url,{
    UseNewUrlParser:true,
    UseUnifiedTopology:true
})

const registerschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true
    },

})

registerschema.pre('save',function(next){
    if(!this.isModified('password'))
    return next()
    this.password = bcrypt.hashSync(this.password,12)
    next()
})


registerschema.methods.comparePassword=function(plaintext,callback){
    return callback(null,bcrypt.compareSync(plaintext,this.password))
}

const registermodal = mongoose.model("data",registerschema)
module.exports = registermodal