const userSchema = require("../Schemas/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

const User = class {
  username;
  email;
  name;
  password;
  phoneNumber;

  constructor({ username, email, password, phoneNumber, name }) {
    this.email = email;
    this.name = name;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  static verifyUsernameAndEmailExits({ username, email }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ username }, { email }],
        });

        // console.log("user did not exists");

        if (userDb && userDb.email === email) {
          return reject("Email already exists");
        }

        if (userDb && userDb.username === username) {
          return reject("Username already taken");
        }

        return resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedpassword = await bcrypt.hash(this.password, 12);

      const user = new userSchema({
        username: this.username,
        email: this.email,
        name: this.name,
        password: hashedpassword,
        phoneNumber: this.phoneNumber,
      });

      try {
        const userDb = await user.save();
        return resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      let userDb = {};
      if (validator.isEmail(loginId)) {
        userDb = await userSchema.findOne({ email: loginId });
      } else {
        userDb = await userSchema.findOne({ username: loginId });
      }

      if (!userDb) {
        return reject("No user found");
      }

      //match password
      const isMatch = await bcrypt.compare(password, userDb.password);
      if (!isMatch) {
        return reject("Password do not matched");
      }

      return resolve(userDb);
    });
  }

  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!ObjectId.isValid(userId)) {
          reject("Invalid userId");
        }

        const userDb = await userSchema.findOne({ _id: ObjectId(userId) });
        if (!userDb) {
          reject("No user found");
        }

        resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = User;

// class
// obj
// obj.fun()

// class
// class.fun()
