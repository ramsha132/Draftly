const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser()); // <== the most IMPORTANT

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

router.get("/add", jwtAuthMiddleware, (req, res) => {
  res.render("create-blog");
});

router.post("/add", jwtAuthMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).send("Title and body are required");
    }

    const userId = req.user._id;

    const newBlog = new Blog({
      title,
      body,
      author: userId,
    });

    await newBlog.save();
    console.log(userId);
    res.redirect("/my-blogs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/view", jwtAuthMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("view", { blogs });
  } catch (error) {
    res.status(500).send("Server error");
  }
});
router.get("/test-protected", jwtAuthMiddleware, (req, res) => {
  res.send(`You are logged in as ${req.user.email}`);
});

router.put("/update", (req, res) => {});

router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author");

    if (!blog) return res.status(404).send("Blog not found");

    res.render("readmore", { blog }); // my readmore.ejs
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
