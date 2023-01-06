const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);

const app = express();
const PORT = process.env.PORT || 8000;

//file import
const db = require("./db");
const AuthRouter = require("./Controllers/Auth");
const BlogsRouter = require("./Controllers/Blogs");
const isAuth = require("./Middlewares/isAuth");
const FollowRouter = require("./Controllers/Follow");

//middlerwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new mongoDBSession({
  uri: process.env.MONGODB_URL,
  collection: "session",
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to blog app");
});

//routing
app.use("/auth", AuthRouter);
//Blogging routes
app.use("/blog", isAuth, BlogsRouter);
//Follow routes
app.use("/follow", isAuth, FollowRouter);

app.listen(PORT, () => {
  console.log(clc.underline(`App is running at`));
  console.log(clc.yellow(`http://localhost:${PORT}`));
});
