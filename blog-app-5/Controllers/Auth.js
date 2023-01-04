const express = require("express");
const AuthRouter = express.Router();
const cleanUpAndValidate = require("../utils/AuthUtils");
const User = require("../Models/User");
const isAuth = require("../Middlewares/isAuth");

AuthRouter.post("/register", (req, res) => {
  const { email, username, password, name, phoneNumber } = req.body;

  cleanUpAndValidate(email, username, password)
    .then(async () => {
      //validate if the user if already registered
      try {
        await User.verifyUsernameAndEmailExits({ username, email });
      } catch (err) {
        return res.send({
          status: 401,
          message: "Error Occured",
          error: err,
        });
      }

      //save the user in db
      const user = new User({
        email,
        phoneNumber,
        username,
        name,
        password,
      });

      try {
        const userDb = await user.registerUser();

        return res.send({
          status: 201,
          message: "Registration Successfull",
          data: userDb,
        });
      } catch (err) {
        return res.send({
          status: 401,
          message: "Error Occured",
          error: err,
        });
      }
    })
    .catch((err) => {
      return res.send({
        status: 400,
        message: "Invalid Data",
        error: err,
      });
    });
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missingg credentials",
    });
  }

  try {
    const userDb = await User.loginUser({ loginId, password });

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      name: userDb.name,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login Successfull",
      data: userDb,
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Error Occurred",
      error: err,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  const userData = req.session.user;
  console.log(userData);
  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 400,
        message: "logout unsuccessfull",
        error: err,
      });
    }

    return res.send({
      status: 200,
      message: "Logout Successfull",
      data: userData,
    });
  });
});

module.exports = AuthRouter;
