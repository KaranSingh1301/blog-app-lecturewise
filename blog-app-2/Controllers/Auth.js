const express = require("express");
const AuthRouter = express.Router();
const cleanUpAndValidate = require("../utils/AuthUtils");

AuthRouter.post("/register", (req, res) => {
  const { email, username, password, name, phoneNumber } = req.body;

  cleanUpAndValidate(email, username, password)
    .then(() => {
      console.log("user", req.body);
      return res.send({
        status: 200,
        message: "User has been created",
      });
    })
    .catch((err) => {
      return res.send({
        status: 400,
        message: "Invalid Data",
        error: err,
      });
    });
});

AuthRouter.post("/login", (req, res) => {
  console.log("everything fine login");
  return res.send({
    status: 200,
  });
});

module.exports = AuthRouter;
