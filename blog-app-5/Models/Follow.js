const FollowSchema = require("../Schemas/Follow");

function followUser({ followingUserId, followerUserId }) {
  return new Promise(async (resolve, reject) => {
    try {
      //check if they follow prevously
      const followObj = await FollowSchema.findOne({
        followerUserId,
        followingUserId,
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

module.exports = { followUser };
