const FollowSchema = require("../Schemas/Follow");
const ObjectId = require("mongodb").ObjectId;
const UserSchema = require("../Schemas/User");
const constants = require("../constants");

function followUser({ followingUserId, followerUserId }) {
  return new Promise(async (resolve, reject) => {
    try {
      //check if they follow prevously
      const followObj = await FollowSchema.findOne({
        followerUserId, //test
        followingUserId, //test1
      });

      if (followObj) {
        reject("User already followed");
      }

      //new entry
      const follow = new FollowSchema({
        followerUserId,
        followingUserId,
        creationDatetime: new Date(),
      });

      try {
        const followDb = follow.save();
        resolve(followDb);
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function followingUsers({ followerUserId, offset }) {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(followerUserId, offset);
      const followDb = await FollowSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
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

      //find({ followerUserId });

      //create an array of followingUser objectId
      let followingUserIds = [];
      followDb[0].data.forEach((followObj) => {
        followingUserIds.push(ObjectId(followObj.followingUserId));
      });

      //find these following userid in user schema

      const followingUserDetails = await UserSchema.aggregate([
        {
          $match: {
            _id: { $in: followingUserIds },
          },
        },
      ]);

      console.log(followingUserDetails);

      // console.log(followDb);
      resolve(followingUserDetails);
    } catch (error) {
      reject(error);
    }
  });
}

function followerUsers({ followingUserId, offset }) {
  return new Promise(async (resolve, reject) => {
    try {
      const followerDb = await FollowSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
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

      //find({ followingUserId });

      let followerUserIds = [];

      followerDb[0].data.forEach((followObj) => {
        followerUserIds.push(ObjectId(followObj.followerUserId));
      });

      const followerUserDetails = await UserSchema.aggregate([
        {
          $match: {
            _id: { $in: followerUserIds },
          },
        },
      ]);

      resolve(followerUserDetails);
    } catch (err) {
      reject(err);
    }
  });
}

function unfollowUser({ followerUserId, followingUserId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const unfollowDb = await FollowSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });

      return resolve(unfollowDb);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { followUser, followingUsers, followerUsers, unfollowUser };
