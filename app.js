require('dotenv').config()

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const router = require("./routes/user");
const blogRouter = require("./routes/blog");
const Blogs = require("./models/blog");
const mongoose = require("mongoose");
const cookiParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/auth");
const Comment = require("./models/comment");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiParser());
app.use(express.static(path.resolve('./public')))
app.use(checkForAuthenticationCookie("token"));
app.use("/blog" , blogRouter)


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB connected");
});


app.get("/blog/:id" , async (req , res) =>{
  // const blog = await Blogs.findById(req.params.id);
  // console.log(blog)
  // return res.render("blog" , {
  //   user: req.user,
  //   blog: blog
  // });

  try {
    const blog = await Blogs.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId : req.params.id}).populate("createdBy");

    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    console.log(comments , req.params);
    return res.render("blog", {
        user: req.user,
        blog: blog,
        comments : comments
    });
} catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
}
})


app.get("/", async (req, res) => {
  const allBlogs = await Blogs.find({});
  return res.render("home" , {
    user : req.user,
    blogs: allBlogs
  });
});
app.get("/logout", (req, res) => {
  return res.clearCookie("token").render("/");
});
app.use("/", router );

app.listen(PORT, () => {
  // if(!err){
  console.log(`PORT is Starting at PORT:${PORT}`);
  // }
});
