const express= require('express')
const hbs=require('hbs')
const app= express();
const path=require('path');
require('dotenv').config();
require('./mongodb');
const Farmer= require('./user');
const Crop=require('./crop');
const port = process.env.PORT ;

const static_path=path.join(__dirname,"../public");
app.use(express.static(static_path));
//console.log(path.join(__dirname,"../public"))

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const multer = require('multer'); 

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(upload.single('image')); 
///// multer end


//routing pages
app.get('/',(req,res)=>{
    //res.send('hello from server..')
    res.render('index')
})
app.get('/loginFarmer',(req,res)=>{
    res.render('loginFarmer');
})
app.get('/loginBroker',(req,res)=>{
    res.render('loginBroker');
})
app.get('/service', (req,res)=>{
    res.render('addCrops');
});
app.get('/addCrops', (req,res)=>{
    res.render('addCrops');
})
app.get('/register',(req,res)=>{
    res.render('register')
})
// app.get('/viewCrops',(req,res)=>{
//     res.render('viewCrops');
// })
// app.get('/shop',(req,res)=>{
//     res.render('viewCrops')
// })
app.get('/price_analysis',(req,res)=>{
    res.render('price_analysis');
})

//create new user in database
app.post('/register',async(req,res)=>{
    try{
        const existingUser= await Farmer.findOne({name:req.body.name});
        if(existingUser){
            console.log('user already exist');
            res.status(200).render('loginFarmer');
        }
        else{
            // res.send(req.body)
            //console.log(req.body);
            const pass1= req.body.password;
            const pass2=req.body.confirm_password;
            //console.log(pass1,pass2);
            if(pass1===pass2)
            {
                //console.log('passwords are same')
                const newUser= new Farmer({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    confirm_password:req.body.confirm_password,
                    gender:req.body.gender,
                    phone:req.body.phone
                })
                const registered= await newUser.save();
                res.status(200).render('index');
                console.log('data saved successfully..');
            }
            else{
                console.log('passwords not same');
            }
        }
    }catch(error){
        res.status(400).send(error);
    }
})
//login user

app.post('/loginFarmer',async(req,res)=>{
    // const name= req.body.name;
    // const password=req.body.password;
    //console.log('request received from loginfarmer')
    const name=req.body.name;
    const password=req.body.password;
    console.log(name,password);
    const user= await Farmer.findOne({name});
    console.log(user);
    if(!user)
    {
        console.log('user not found');
        res.status(404).send('user not found');
    }
    else{
        if(user.password===password)
        {
            console.log('login successful');
            res.status(200).render('index');
        }
        else{
            console.log('invalid credentials');
        }
    }

})

//upload crops
app.post('/addCrops', (req,res)=>{
    const {name ,rate, quantity }=req.body;
    const image= req.file.filename;
    const newCrop = new Crop({
        name:name,
        image:image,
        rate:rate,
        quantity:quantity
    });
    newCrop.save()
        .then(() => {
            console.log('crop added successfully..');
            res.status(200);
            res.redirect('/');    
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error uploading crop');
        });
})

//viewing crops 
app.get('/viewCrops',async (req,res)=>{
    try{
        const crops= await Crop.find();
        res.render('viewCrops', { crops: crops });
    }
    catch(err){
        console.log('error while fetching crops' , err);
    }
})


app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
}) 