const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const router = express.Router();
const userController = require("../controllers/userController");
const User = require("../models/userModel");
const isAuth = require("../middleware/isAuth");

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
    body("password").trim().isLength({ min: 6 }),
  ],
  userController.postSignUp
);

router.get("/user", isAuth, userController.getUser);

router.put("/user", isAuth, userController.putUser);
router.post(
  "/user/changePassword",
  [
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please enter your password")
      .custom((pass, { req }) => {
        if (!pass) {
          throw new Error("Please enter your password");
        }
        return User.findById(req.body.userId).then((user) => {
          return bcrypt.compare(pass, user.password).then((isEqual) => {
            console.log(isEqual);
            if (!isEqual) {
              throw new Error("Incorrect Password");
            }
            return true;
          });
        });
      }),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("password length must be minimum 6 character"),
    body("confirmPassword").custom((pass, { req }) => {
      if (pass !== req.body.newPassword) {
        throw new Error("New password and confirm password does not match");
      }
      return true;
    }),
  ],
  isAuth,
  userController.postPasswordChange
);

module.exports = router;
