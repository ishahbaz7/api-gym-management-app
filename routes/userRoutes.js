const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const User = require("../models/userModel");

router.post(
  "/sign-in",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("email").custom((email) => {
      return User.findOne({ email }).then((user) => {
        console.log("user", user);
        if (!user) {
          return Promise.reject("Email not found!");
        }
      });
    }),
    body("password").not().isEmpty().withMessage("Please enter your password"),
  ],
  userController.postSignIn
);

router.post(
  "/auth/sign-up",
  [
    body("name").not().isEmpty().withMessage("Please enter your name"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("email").custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject("User already exist");
        }
      });
    }),
    body("mobileNo").not().isEmpty().withMessage("Please enter your mobile no"),
    body("password").trim().isLength({ min: 5 }),
  ],
  userController.postSignUp
);

module.exports = router;
