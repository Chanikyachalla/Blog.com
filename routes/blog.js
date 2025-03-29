const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    }
  })

  const upload = multer({storage : storage });

router.get('/add-new', (req,res)=>{
    return res.render("addBlog",{
        user: req.user,
    });
});

router.post('/post-new',upload.single("coverImage") ,  async (req,res)=>{
    const { title,description, body } = req.body;
    const a = await Blog.create({
       
        title,
        description,
        body,
        createdBy : req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
   })
   res.redirect("/");
})

router.get('/:id' , async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    
    return res.render("blog",{
        user: req.user,
        blog,
        comments,
    });
});

router.post("/comment/:blogId", async (req,res)=>{
    const c = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;