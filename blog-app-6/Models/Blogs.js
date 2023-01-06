const blogSchema = require("../Schemas/Blogs");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDatetime;
  blogId;

  constructor({ title, textBody, userId, creationDatetime, blogId }) {
    this.title = title;
    this.textBody = textBody;
    this.creationDatetime = creationDatetime;
    this.userId = userId;
    this.blogId = blogId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new blogSchema({
        title: this.title,
        textBody: this.textBody,
        userId: this.userId,
        creationDatetime: this.creationDatetime,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getBlogs({ offset }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogsDb = await blogSchema.aggregate([
          { $sort: { creationDatetime: -1 } }, //DESC -1, ASCD 1
          {
            $facet: {
              data: [
                { $skip: parseInt(offset) },
                { $limit: constants.BLOGSLIMIT },
              ],
            },
          },
        ]);

        resolve(blogsDb[0].data);
      } catch (err) {
        reject(err);
      }
    });
  }
  //
  static myBlogs({ userId, offset }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogsDb = await blogSchema.aggregate([
          { $match: { userId: ObjectId(userId) } },
          { $sort: { creationDatetime: -1 } },
          {
            $facet: {
              data: [
                { $skip: parseInt(offset) },
                { $limit: constants.BLOGSLIMIT },
              ],
            },
          },
        ]);
        console.log(blogsDb);
        resolve(blogsDb[0].data);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  getDataofBlogfromId() {
    return new Promise(async (resolve, reject) => {
      try {
        const blog = await blogSchema.findOne({ _id: ObjectId(this.blogId) });
        resolve(blog);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        let newBlogdata = {};
        if (this.title) {
          newBlogdata.title = this.title;
        }

        if (this.textBody) {
          newBlogdata.textBody = this.textBody;
        }

        const oldDbdata = await blogSchema.findOneAndUpdate(
          {
            _id: ObjectId(this.blogId),
          },
          newBlogdata
        );

        return resolve(oldDbdata);
      } catch (error) {
        return reject(error);
      }
    });
  }

  deleteBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        const blog = await blogSchema.findOneAndDelete({
          _id: ObjectId(this.blogId),
        });
        resolve(blog);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blogs;
