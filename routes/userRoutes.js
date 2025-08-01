const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const bcrypt = require("bcrypt"); // assuming you're using bcrypt
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const {
  jwtAuthMiddleware,
  generateToken,
} = require("../middlewares/requireAuth");

//  GET the  Register Page
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

//  POST Register Logic
router.post("/register", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // for Checcking error only
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { error: "Email is already registered" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.send("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid email or password");

// to create a Token
    const token = jwt.sign(
      {   _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // setting the token  as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // to set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in ms
    });

    
    res.send(" message: Welcome back" );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




router.get("/my-blogs", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
console.log( userId)

    const myBlogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    res.render("my-blogs", { blogs: myBlogs }); // Render EJS view with user's blogs
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).send("Server error");
  }
});





module.exports = router;
