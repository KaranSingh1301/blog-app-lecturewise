const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  textBody: {
    type: String,
    required: true,
  },
  creationDatetime: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId, //fk to user schema
    required: true,
  },
});

module.exports = mongoose.model("Blogs", blogSchema);
