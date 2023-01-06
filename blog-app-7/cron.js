const cron = require("node-cron");
const ObjectId = require("mongodb").ObjectId;
const blogSchema = require("./Schemas/Blogs");

function cleaUpBin() {
  cron.schedule(
    "1 * * * * *",
    async () => {
      //find all the blogs where deleted is true
      const blogsDb = await blogSchema.aggregate([
        { $match: { deleted: true } },
      ]);
      console.log(blogsDb);

      blogsDb.forEach(async (blog) => {
        const deletionDatetime = new Date(blog.deletionDatetime).getTime();
        const currentDatetime = Date.now();
        // console.log(deletionDatetime);
        // console.log(currentDatetime);

        const diff = (currentDatetime - deletionDatetime) / (1000 * 60);
        console.log(diff);
        if (diff >= 5) {
          await blogSchema.findOneAndDelete({ _id: ObjectId(blog._id) });
          console.log(`Blog has been deleted : ${blog._id}`);
        }
      });

      //check if they are 30 days old
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
}
module.exports = { cleaUpBin };
