const mongoose = require("mongoose");
const { createHmac,randomBytes} = require('crypto');
const   { createTokenForUser,
    validateToken } = require("../services/auth");

const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
    },
  
    bio:{
        type:String,
    },
    profileImageURL:{
      type:String,
      default:"/uploads/useravatar.jpg",
    },
    role:{
        type:String,
        enum:["USER", "ADMIN"],
        default:"USER",
    }

}, {timestamps: true});

UserSchema.pre("save",async function(next){
    const user = this;

    if(!user.isModified("password")) return;
     
    const salt = randomBytes(16).toString("hex");
    const  hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();


});

UserSchema.static("matchPassword",async function(email, password){

    const user= await this.findOne({email});
    console.log(user);
    if(!user){
       
      throw new Error("Incorrect email or passwoed");
    }
   
    const salt= user.salt;
    const hashedPassword = user.password;
    const hashedInputPassword =  createHmac("sha256", salt).update(password).digest("hex");
      

//   if( hashedPassword  !== hashedInputPassword)throw new Error("incorrect password");

  const token = createTokenForUser(user);
  return token;
})

const User = mongoose.model('User',UserSchema );

module.exports=User;

