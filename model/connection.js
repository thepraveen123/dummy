const { error } = require('console')
const mongoose = require('mongoose')

var url ='mongodb+srv://praveenkumaar715:praveen123@cluster0.p9f3rra.mongodb.net/Jewellery?retryWrites=true&w=majority'

mongoose.connect(url,{
    UseNewUrlParser:true,
    UseUnifiedTopology:true
})

.then(()=>{
    console.log("database connected")
})
.catch((error)=>{
    console.log(error)
})