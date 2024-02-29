const { Schema, default: mongoose, model } = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true
    },
    cover_image: {
      type: String,
      required : false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
