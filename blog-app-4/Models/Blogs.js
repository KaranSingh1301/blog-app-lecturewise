const blogSchema = require("../Schemas/Blogs");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDatetime;

  constructor({ title, textBody, userId, creationDatetime }) {
    this.title = title;
    this.textBody = textBody;
    this.creationDatetime = creationDatetime;
    this.userId = userId;
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
};

module.exports = Blogs;
