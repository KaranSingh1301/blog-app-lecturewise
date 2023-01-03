const express = require("express");
const BlogsRouter = express.Router();
const User = require("../Models/User");
const Blogs = require("../Models/Blogs");

BlogsRouter.post("/create-blog", async (req, res) => {
  const title = req.body.title;
  const textBody = req.body.textBody;
  const userId = req.session.user.userId;
  const creationDatetime = new Date();

  //wrapper data validation inside blogUtil function
  if (!userId) {
    return res.send({
      status: 400,
      message: "Invalid userId",
    });
  }

  if (
    !title ||
    !textBody ||
    typeof title !== "string" ||
    typeof textBody !== "string"
  ) {
    return res.send({
      status: 400,
      message: "Data Invalid",
    });
  }

  if (title.length > 50) {
    return res.send({
      status: 400,
      message: "Blog Title is too long. Should be less than 50 char",
    });
  }

  if (textBody.length > 1000) {
    return res.send({
      status: 400,
      message: "Blog is too long. Should be less than 1000 char",
    });
  }

  //verify the userid, reject if not present
  try {
    await User.verifyUserId({ userId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: err,
    });
  }

  //creating a blog obj
  const blog = new Blogs({ title, textBody, userId, creationDatetime });
  try {
    const blogDb = await blog.createBlog();
    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: err,
    });
  }
});

BlogsRouter.get("/get-blogs", async (req, res) => {
  const offset = req.query.offset || 0;

  //call a function to read blogs from db
  try {
    const blogs = await Blogs.getBlogs({ offset });

    return res.send({
      status: 200,
      message: "Read successfully",
      data: blogs,
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Read Unsuccessfully",
      error: err,
    });
  }
});

BlogsRouter.get("/my-blogs", async (req, res) => {
  const userId = req.session.user.userId;
  const offset = req.query.offset || 0;
  console.log(userId, offset);
  //call a function to read blogs from db
  try {
    const blogs = await Blogs.myBlogs({ userId, offset });

    return res.send({
      status: 200,
      message: "Read successfully",
      data: blogs,
    });
  } catch (err) {
    return res.send({
      status: 401,
      message: "Read Unsuccessfully",
      error: err,
    });
  }
});

module.exports = BlogsRouter;
