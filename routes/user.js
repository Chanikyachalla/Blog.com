const express = require("express");
const User= require("../models/user");
const router = express.Router();

router.get("/signin", (req,res)=>{
    return res.render("signin");
});

router.get("/signup" , (req, res)=>{
    return res.render("signup");
})

router.post("/signup",async (req,res)=>{
    const { fullName, email , password } = req.body;
     const newUser = new User({ fullName, email, password });
    await newUser.save();
    return res.redirect("/");
})

router.post("/signin", async(req,res)=>{
    const { email , password } = req.body;
 try{
    const token   =  await User.matchPassword(email,password);
    console.log(token);
    return res.cookie('token', token).redirect("/");
 }catch(err){
    return res.render("signin",{
        error:err.message,
    })
 }
   
});

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports= router;