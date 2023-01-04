const express = require("express");
const { followUser } = require("../Models/Follow");
const FollowRouter = express.Router();
const User = require("../Models/User");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;
  console.log(followerUserId);
  console.log(followingUserId);
  //validating userId of both follower and following
  //   try {
  //     await User.verifyUserId({ followerUserId });
  //   } catch (err) {
  //     return res.send({
  //       status: 400,
  //       message: "Invalid Follower UserId",
  //       error: err,
  //     });
  //   }

  //   try {
  //     await User.verifyUserId({ followingUserId });
  //   } catch (err) {
  //     return res.send({
  //       status: 400,
  //       message: "Invalid Following UserId",
  //       error: err,
  //     });
  //   }

  //create a follow request

  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Followed Successfully",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Request Invalid",
      error: error,
    });
  }
});

module.exports = FollowRouter;
