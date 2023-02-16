const Trainee = require("../models/traineeModel");
const TraineeInvoice = require("../models/traineeInvoiceModel");
const Membership = require("../models/membershipModel");
const { validationResult } = require("express-validator");
const fs = require("fs");
const errorHandler = require("../utile/errorHandler");
const path = require("path");

exports.getTrainees = ({ userId }, req, res, next) => {
  Trainee.find({ userId })
    .sort({ createdAt: -1 })
    .populate("traineeInvoiceId")
    .then((trainees) => {
      return res.status(200).json({ trainees });
    })
    .catch((err) => {
      console.log(err);
      res.json(404).json({ result: "Not fount" });
    });
};

exports.getMemExpTrainees = ({ userId }, req, res, next) => {};

exports.getTrainee = ({ userId }, req, res, next) => {
  Trainee.findOne({ _id: req.params.id, userId })

    .then((trainee) => {
      return res.status(200).json(trainee);
    })
    .catch((err) => {
      next(err);
    });
};

exports.renewMembership = ({ userId }, req, res, next) => {
  const {
    _id,
    membershipType,
    startDate,
    endDate,
    amount,
    membershipTitle,
    remainingBalance,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  TraineeInvoice.create({
    startDate,
    endDate,
    amount,
    membershipTitle,
    membershipId: membershipType,
    traineeId: _id,
    userId,
    remainingBalance,
  })
    .then((invoice) => {
      Trainee.findOneAndUpdate(
        { _id, userId },
        {
          traineeInvoiceId: invoice._id,
          membershipEndDate: endDate,
          status: "Active",
        }
      ).then((trainee) => {
        return res
          .status(201)
          .json({ ...trainee.toObject(), traineeInvoice: invoice.toObject() });
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postTrainee = ({ userId }, req, res, next) => {
  var membershipObj = {};
  var traineeInvoiceId = {};
  const errors = validationResult(req);
  const {
    name,
    email,
    mobileNo,
    address,
    membershipType,
    membershipTitle,
    amount,
    remainingBalance,
    startDate,
    endDate,
    profileImg,
  } = req.body;
  var traineeResult = {
    traineeInvoiceId: { startDate, endDate, membershipTitle },
  };
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  Trainee.create({
    name,
    email,
    mobileNo,
    address,
    profileImg,
    membershipEndDate: endDate,
    userId,
  })
    .then((trainee) => {
      traineeResult = { ...traineeResult, ...trainee.toObject() };
      Membership.findById(membershipType)
        .select("membershipTitle")
        .then((membership) => {
          membershipObj = membership;

          TraineeInvoice.create({
            startDate,
            endDate,
            amount,
            remainingBalance,
            traineeId: traineeResult._id,
            membershipId: membershipObj._id,
            membershipTitle: membership.membershipTitle,
            userId,
          }).then((traineeInvoice) => {
            traineeInvoiceId = traineeInvoice._id;
            Trainee.updateOne(
              { _id: traineeInvoice.traineeId },
              {
                traineeInvoiceId,
              }
            ).then((result) => {
              return res.status(201).json(traineeResult);
            });
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.putTrainee = ({ userId }, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(errors);
    throw error;
  }
  const { _id, name, email, mobileNo, address, profileImg } = req.body;
  Trainee.findOne({ userId, _id })
    .then((user) => {
      user.name = name;
      user.email = email;
      user.mobileNo = mobileNo;
      user.address = address;
      user.profileImg = profileImg;
      return user.save();
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteTrainee = ({ userId }, req, res, next) => {
  const { id } = req.params;
  TraineeInvoice.deleteMany({ traineeId: id, userId })
    .then((result) => {
      Trainee.findOneAndDelete({ _id: id, userId }).then((response) => {
        if (response) {
          fs.unlink(response.profileImg, function (err) {
            console.log(err);
          });
          return res.status(202).json(response);
        }
        const error = new Error("user not found");
        throw error;
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.deleteTrainees = ({ userId }, req, res, next) => {
  const { ids } = req.body;
  TraineeInvoice.deleteMany({ userId, traineeId: ids })
    .then((result) => {
      Trainee.find({ id: ids }).then((trainees) => {
        trainees.map((val) => {
          fs.unlink(val.profileImg, function (err) {
            console.log(err);
          });
        });
      });
      return Trainee.deleteMany({ _id: ids });
    })
    .then((result) => {
      res.status(202).json("ok");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMembershipTypes = ({ userId }, req, res, next) => {
  Membership.find({ userId })
    .select("membershipTitle")
    .select("_id")
    .select("pkg")
    .select("amount")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getTraineeCount = ({ userId }, req, res, next) => {
  const { type } = req.query;
  var status = type == "undefined" ? ["Active", "In-active"] : type;
  Trainee.find({
    userId,
    status,
  })
    .count()
    .then((count) => {
      return res.status(200).json(count);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getExpiredCount = ({ userId }, req, res, next) => {
  var date = new Date().toISOString();
  Trainee.find({ userId, status: "Active", membershipEndDate: { $lte: date } })
    .count()
    .then((count) => {
      console.log(count);
      res.status(200).json(count);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
