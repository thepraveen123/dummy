const bodyParser = require('body-parser');
const express = require('express')
const app =express();

const cookieParser = require('cookie-parser')

const session = require('express-session')


app.use(cookieParser());

app.use(
    session({
        key:'user_id',
        secret:'randomstuffs',
        resave:false,
        saveUninitialized:false,
        cookie:{
            expires:6000000,
        }
        }));

        app.use((req,res,next)=>{
            if(req.cookies.user_id && !req.session.user){
                res.clearCookie("user_id")
            }
            next()
        })

        var sessionChecker = (req,res,next)=>{
            if(req.session.user &&  req.cookies.user_id){
                res.redirect('/dashboard')
            }
            else{
                next()
            }
        }


const router = express.Router()

app.set('view engine','ejs')
const mongoose = require('mongoose')

app.use(express.static('public'))
const registermodal = require('./model/registerschema.js');
const contactmodel = require('./model/contactschema.js')



mongoose.set('strictQuery',false);
app.use(bodyParser.urlencoded({extended:true}));




// app.get('/',function(req,res){
//     res.send('hello')
// })

router.get('/',function(req,res){
    res.render('home')
})

router.get('/about',function(req,res){
    res.render('about')
})

router.get('/contactform',function(req,res){
    res.render('contactform')
})

router.get('/register', sessionChecker,  function(req,res){
    res.render('register')
})






// dashboard

router.get('/dashboard',function(req,res){
   
if(req.session.user && req.cookies.user_id){
    res.render('./dashboard/dashboard')
 
}
else{
    res.redirect('/dashboard')
}
   
   
   
})

router.get('/logout',(req,res)=>{
    if(req.session.user && req.cookies.user_id){
        res.clearCookie('user_id')
        res.redirect('/')
    }
    else{
        res.redirect('/register')
    }
})

// router.get('/viewregister',function(req,res){
//     res.render('./dashboard/viewregister')
// })



router.get('/viewregister',function(req,res){
    registermodal.find().then((data)=>{
        res.render('./dashboard/viewregister',{data:data})
        console.log(data)
    })
    .catch((error)=>{
        console.log(error)
    })
})

router.get('/viewcontact',(req,res)=>{
    contactmodel.find().then((data)=>{
        res.render('./dashboard/viewcontact',{data:data})
        console.log(data)
    })
    .catch((error)=>{
        console.log(error)
    })
})

// router.get('/viewregister',function(req,res){
//    registermodal.find().then((data)=>{
//      res.render('./dashboard/viewregister',{data:data});
//      console.log(data)
//     })
//     .catch((error)=>{
//     console.log(error)
//     })
//  })



router.post('/signup',(req,res)=>{
    var signup = new registermodal({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        number:req.body.number
    })

    signup.save().then(()=>{
        console.log("data sent")
        res.redirect('/register')
    })
    .catch((error)=>{
        console.log(error)
        res.redirect('/register')
    })
})

// contact api

router.post('/contact',(req,res)=>{
    var contact = new contactmodel({
        email:req.body.email,
        location:req.body.location
    })

    contact.save().then(()=>{
        console.log("contact data sent")
        res.redirect('/contactform')
    })
    .catch((error)=>{
        console.log(error)
    })
})


// login

router.post('/login', async (req,res)=>{
    var email = req.body.email,
    password = req.body.password

    try{
        var user = await registermodal.findOne({email:email}).exec()
        if(!user){
            res.redirect('/register')
        }
        user.comparePassword(password,(error,match)=>{
            if(!match){
                res.redirect('/register')
            }
        })
        req.session.user = user
        res.redirect('/dashboard')
        res.status(200).json({ message: 'Redirecting to dashboard page'})
    }
    catch(error){
        console.log(error)
    }
})


//delete

router.get('/remove/:id',(req,res)=>{
    registermodal.findByIdAndDelete(req.params.id).then(()=>{
        res.redirect('/viewregister')
    })
    .catch((error)=>{
        res.redirect('/dashboard')
        console.log(error)
    })
})


// show

router.get('/show/:id',(req,res)=>{
    registermodal.findById(req.params.id).then((data)=>{
        res.render('./dashboard/showuser',{data:data})
        console.log(data)
    })
    .catch((error)=>{
        console.log(error)
    })
})


router.get('/edit/:id',(req,res)=>{
    registermodal.findById(req.params.id).then((data)=>{
        res.render('./dashboard/editregister',{data:data})
        console.log(data)
    })
    .catch((error)=>{
        console.log(error)
    })
})


router.post('/edit/:id',(req,res)=>{
    var update ={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        number:req.body.number
    }
    registermodal.findByIdAndUpdate(req.params.id,update).then(()=>{
        res.redirect('/viewregister')
    })
    .catch((error)=>{
        console.log(error)
    })
})


router.get('/addproduct',function(req,res){
    res.render('./dashboard/addproduct')
})

router.get('/viewproduct',function(req,res){
    res.render('./dashboard/viewproduct')
})
app.use('/',router)
app.listen(4200)