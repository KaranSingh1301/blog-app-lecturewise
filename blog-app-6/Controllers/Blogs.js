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

// {
//   data: {
//     title: "",
//     textBody: "",
//   },
//   blogId: "",
//   userId: session
// }

BlogsRouter.post("/edit-blog", async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  //data checking
  if (!title && !textBody) {
    return res.send({
      status: 400,
      message: "Invalid Data format",
    });
  }
  try {
    //get the blog with blogId
    const blog = new Blogs({ blogId, title, textBody });
    const blogDb = await blog.getDataofBlogfromId();

    //validate the blog owner with the userid present in the session
    // if (blogDb.userId.toString() !== userId.toString()) {
    //id1.equals(id2)
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 402,
        message: "Not allowed to edit",
        message: "Blog belongs to other user",
      });
    }

    //put the check to allow only to edit within 30 mins
    const currentDateTime = Date.now(); //object
    const creationDatetime = new Date(blogDb.creationDatetime); //string --> date obj
    const diff = (currentDateTime - creationDatetime.getTime()) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 405,
        message: "Edit unsuccessfull",
        error: "Cannot edit after 30 mins of creation",
      });
    }

    //everything is fine then update the blog

    try {
      const oldBlogDb = await blog.updateBlog();

      return res.send({
        status: 200,
        message: "Updation successfull",
        data: oldBlogDb,
      });
    } catch (error) {
      return res.send({
        status: 401,
        message: "Updation Failed",
        error: err,
      });
    }
  } catch (err) {
    return res.send({
      status: 401,
      message: "Updation Failed",
      error: err,
    });
  }
});

BlogsRouter.post("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  //verify the userId
  // if (!ObjectId.isValid(userId)) {
  //   return res.send({
  //     status: 401,
  //     message: "Invalid ObjectId",
  //   });
  // }

  try {
    await User.verifyUserId({ userId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: err,
    });
  }

  try {
    //get the blog with blogId
    const blog = new Blogs({ blogId });
    const blogDb = await blog.getDataofBlogfromId();

    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 402,
        message: "Not allowed to delete",
        error: "Blog belongs to other user",
      });
    }

    //delete the blog

    const blogData = await blog.deleteBlog();

    return res.send({
      status: 201,
      message: "Deletion Successfull",
      data: blogData,
    });
  } catch (error) {
    return res.send({
      status: 401,
      message: "Deletion Failed",
      error: error,
    });
  }
});

module.exports = BlogsRouter;
