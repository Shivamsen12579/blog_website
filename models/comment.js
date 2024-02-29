const { Schema, default: mongoose, model } = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
    }
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);

module.exports = Comment;