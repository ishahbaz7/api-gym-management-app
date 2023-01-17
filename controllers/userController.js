const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const errorHandler = require("../utile/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postSignIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  const { email, password } = req.body;
  var userData = {};
  User.findOne({ email })
    .then((user) => {
      userData = user;
      console.log("password", password);
      console.log("passwordUsr", user);
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error();
        error.statusCode = 401;
        error.data = [{ param: "password", msg: "invalid password!" }];
        error.message = "invalid credentials";
        throw error;
      }
      const token = jwt.sign(
        {
          email: userData.email,
          userId: userData._id.toString(),
        },
        "e0ba87d5-467e-4695-ac74-4605de04aaa4",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 1,
        name: userData.name,
        email: userData.email,
        mobileNo: userData.mobileNo,
        profileImg: userData.profileImageUrl,
        userId: userData._id,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postSignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  const { name, mobileNo, email, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashPass) => {
      const user = new User({
        name,
        mobileNo,
        email,
        password: hashPass,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getUser = ({ userId }, req, res, next) => {
  User.findById(userId)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.putUser = ({ userId }, req, res, next) => {
  var upUser = req.body;
  delete upUser._id;
  User.updateOne({ _id: userId }, upUser)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postPasswordChange = ({ userId }, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  console.log(req);
  const { newPassword } = req.body;
  User.findById(req.body.userId)
    .then((user) => {
      return bcrypt.hash(newPassword, 12).then((hashPass) => {
        user.password = hashPass;
        user.save();
      });
    })
    .then((upUser) => {
      res.status(202).json("Ok");
    })
    .catch((err) => {
      next(err);
    });
};
