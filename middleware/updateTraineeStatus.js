const mongoose = require("mongoose");
const Trainee = require("../models/traineeModel");
const { addDays } = require("../utile/dateTime");

const updateTraineeStatus = (req, res, next) => {
  Trainee.updateMany(
    { membershipEndDate: { $lt: addDays(new Date(), -10) } },
    { status: "In-active" },
    function (err, doc) {
      // console.log(err, doc);
    }
  );
  Trainee.updateMany(
    { membershipEndDate: { $gte: addDays(new Date(), -10) } },
    { status: "Active" },
    function (err, doc) {
      // console.log(err, doc);
    }
  );
  next();
};

module.exports = updateTraineeStatus;
