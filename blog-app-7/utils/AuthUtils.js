const validator = require("validator");

function cleanUpAndValidate(email, username, password) {
  return new Promise((resolve, reject) => {
    if (!password || !email || !username) {
      return reject("Missing credentials");
    }

    if (typeof email !== "string") {
      return reject("Email is not a string");
    }

    if (!validator.isEmail(email)) {
      return reject("Invalid Email format");
    }

    if (typeof username !== "string") {
      return reject("Username is not a string");
    }
    if (typeof password !== "string") {
      return reject("password is not a string");
    }

    if (username.length < 3 || username.length > 30) {
      return reject("the length of the username should be btw 3-30 chacahters");
    }

    if (password && !validator.isAlphanumeric(password)) {
      return reject("Password should contain alphabat and numbers");
    }

    return resolve();
  });
}

module.exports = cleanUpAndValidate;
