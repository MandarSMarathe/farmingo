const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('connection successful');
    console.log(process.env.MONGODB_URI);
}).catch((e)=>{
    console.log('database not connected..');
})