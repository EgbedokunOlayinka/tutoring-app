const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/routes');
const PORT = process.env.port || 5000;
const createCategories = require('./controllers/auth-category'); 


mongoose.connect("mongodb+srv://Olayinka:Frankenstein@cluster0-7seiw.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(result=>{
    console.log('Database connected');
    app.listen(PORT);
    })
.catch(err=>console.log(err))

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// ROUTES
app.use('/api/v1', authRoutes);
