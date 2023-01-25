const Membership = require("../models/membershipModel");
const { validationResult } = require("express-validator");

exports.getMemberships = ({ userId }, req, res, next) => {
  Membership.find({ userId })
    .sort({ amount: 1 })
    .then((memberships) => {
      return res.status(200).json(memberships);
    })
    .catch((err) => {
      console.log(err);
      res.json(404).json({ result: "Not found" });
    });
};

exports.postMembership = ({ userId }, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed!");
    error.statusCode = 402;
    error.data = errors.array();
    throw error;
  }
  Membership.create({ ...req.body, userId })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteMembership = ({ userId }, req, res, next) => {
  Membership.findOneAndDelete({ _id: req.params.id, userId })
    .then((result) => {
      if (result) {
        return res.status(202).json(result);
      }
      const error = new Error("user not found");
      throw error;
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ err });
    });
};
