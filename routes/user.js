const { Router } = require("express");
const router = Router();
const User = require("../models/user");
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", async (req, res) => {
  console.log(req.body);
  // console.log(req.body)
  const { fullName, email, password } = req.body;
  console.log(fullName, email, password);
  await User.create({
    fullName,
    email,
    password,
  });
  // console.log("")
  return res.render("home");
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log(token);
        return res.cookie("token" , token).render("home" , {
          success : "Login Success"
        });
    } catch (error) {
        return res.render("signin", {
            error : "Incorrect email and Password"
        })
    }
 
});

module.exports = router;
