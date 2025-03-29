
require("dotenv").config();

const express = require("express");
const Path = require("path");
const mongoose= require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthentication } = require("./middlewares/auth");



const app = express();
const PORT = process.env.PORT || 8000;

const Blog = require("./models/blog");
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connection succesfull");
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.set('viewa',Path.resolve("./views"));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static('public'));

app.get('/', async(req,res)=>{
    const allBlogs= await Blog.find({});

    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})
app.use('/blog', blogRouter);
app.use("/user" ,  userRouter);

app.listen(PORT, ()=>{
    console.log(`server started at PORT:${PORT}`);
});

