
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');  // Import user model
const authController = require('./controllers/authController');
const path=require('path')
dotenv.config();
const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))
const port = 4000;
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginda', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})


// Routes
app.post('/login',authController.login);
app.post('/reg', authController.register);


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});