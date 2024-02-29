const { Schema, default: mongoose, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { use } = require("../routes/user");
const { createTokenForUser } = require("../service/auth");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: "./public/images.png",
    },
    role: {
      type: String,
      enmu: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const secret = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", secret)
    .update(user.password)
    .digest("hex");
  this.salt = secret;
  this.password = hashPassword;
  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  const hashedPassword = user.password;
  const salt = user.salt;
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (userProvidedHash !== hashedPassword) {
    throw new Error("incorrect Password");
  }
  const token = createTokenForUser(user);
  // console.log("token" , token)
  return token;
});

const User = model("user", userSchema);

module.exports = User;
