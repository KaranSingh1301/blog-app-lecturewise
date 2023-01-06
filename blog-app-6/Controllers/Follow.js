const express = require("express");
const {
  followUser,
  followingUsers,
  followerUsers,
  unfollowUser,
} = require("../Models/Follow");
const FollowRouter = express.Router();
const User = require("../Models/User");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;
  //   console.log(followerUserId);
  //   console.log(followingUserId);
  //validating userId of both follower and following
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Follower UserId",
      error: err,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

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

//Following List
FollowRouter.post("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const offset = req.query.offset || 0;
  //verify the userid
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  //get the following list

  try {
    const data = await followingUsers({ followerUserId, offset });

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "You have not followed anyone yet",
        data: data,
      });
    }

    return res.send({
      status: 200,
      message: "Following list",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error Occured",
      error: error,
    });
  }
});

//followers list

FollowRouter.post("/followers-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const offset = req.query.offset || 0;

  //validate the user id
  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  try {
    const data = await followerUsers({ followingUserId, offset });

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "No one follows you :(",
        data: data,
      });
    }

    return res.send({
      status: 200,
      message: "Follower list",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error Occured",
      error: error,
    });
  }
});

FollowRouter.post("/unfollow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  console.log(followerUserId, followingUserId);

  //validation of object Id's
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Follower UserId",
      error: err,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  try {
    const unfollowDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "unfollow successfully",
      data: unfollowDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error Occurred",
      error: error,
    });
  }
});

module.exports = FollowRouter;

//test-> test1
//test -> test2

//test->test1
//test2->test1
