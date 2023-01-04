const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  followingUserId: {
    type: String,
    required: true,
  },
  followerUserId: {
    type: String,
    required: true,
  },
  creationDatetime: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Follow", FollowSchema);
