require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');
const app = express();

// console.log(process.env.API_KEY);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});



const User = new mongoose.model("User", userSchema);
app.get('/', (req, res) => {
    res.render("home");
});
app.get('/login', (req, res) => {
    res.render("login");
});
app.get('/register', (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password

    });
    // await newUser.save();
    try {
        newUser.save();
        res.render('secrets');
    } catch (err) {
        console.log(err);
    }
})
app.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ email: username });
if (foundUser.password === password) {
  res.render('secrets');

}
else{
    console.log("not Found");
}
})
app.listen(3000, function () {
    console.log("Server started on port 3000");
})