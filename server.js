const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectedDB = require("./config/db");
const cookieParser = require('cookie-parser');

connectedDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes")
app.use("/", userRoutes);
app.use("/",blogRoutes );




app.listen(3000, () => {
  console.log("App listening on port 3000");
});
