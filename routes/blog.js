const { Router } = require("express");
const router = Router();
const multer = require("multer");
const Blog = require("../models/blog");
const path = require("path");
const User = require("../models/user");
const Comment = require("../models/comment");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.get("/addBlog", (req, res) => {
  return res.render("add_blog");
});

router.post("/comment/:blogId" , async(req , res) =>{
  await Comment.create({
    content: req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id
  })
  console.log(req.body)
  return res.redirect(`/blog/${req.params.blogId}`)
})



router.post("/", upload.single('cover_image') ,async (req, res) => {
    const {title , body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        cover_image : `/uploads/${req.file.filename}`
    })
    console.log(`/blog/${blog._id}`)
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
