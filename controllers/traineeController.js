const Trainee = require("../models/traineeModel");
const TraineeInvoice = require("../models/traineeInvoiceModel");
const Membership = require("../models/membershipModel");
const { validationResult } = require("express-validator");
const fs = require("fs");
const errorHandler = require("../utile/errorHandler");

exports.getTrainees = ({ userId }, req, res, next) => {
  console.log("decodeToken from controller", userId);
  Trainee.find({ userId })
    .sort({ membershipEndDate: -1 })
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
    .select("name")
    .select("amount")
    .then((trainee) => {
      return res.status(200).json(trainee);
    })
    .catch((err) => {
      next(err);
    });
};

exports.renewMembership = ({ userId }, req, res, next) => {
  const { _id, membershipType, startDate, endDate, amount, membershipTitle } =
    req.body;
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
        console.log(trainee);
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
  console.log("req.body", req.body);
  const {
    name,
    email,
    mobileNo,
    address,
    membershipType,
    membershipTitle,
    amount,
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
      console.log("trainee", trainee);
      traineeResult = { ...traineeResult, ...trainee.toObject() };
      Membership.findById(membershipType)
        .select("membershipTitle")
        .then((membership) => {
          console.log("membership", membership);
          membershipObj = membership;

          TraineeInvoice.create({
            startDate,
            endDate,
            amount,
            traineeId: traineeResult._id,
            membershipId: membershipObj._id,
            membershipTitle: membership.membershipTitle,
            userId,
          }).then((traineeInvoice) => {
            traineeInvoiceId = traineeInvoice._id;
            console.log("traineeInv", traineeInvoice);
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
  console.log("ids", ids);
  TraineeInvoice.deleteMany({ userId, traineeId: ids })
    .then((result) => {
      Trainee.deleteMany({ _id: ids }).then((result) => {
        console.log("result", result);
        res.status(202).json("ok");
      });
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

exports.getTraineeInvoice = ({ userId }, req, res, next) => {
  const { id } = req?.params;

  TraineeInvoice.find({ traineeId: id, userId })
    .sort({ startDate: 1 })
    .then((traineeInv) => {
      console.log(traineeInv);
      res.status(202).json(traineeInv);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCollectionStats = ({ userId }, req, res, next) => {
  TraineeInvoice.find({ userId })
    .select("startDate")
    .select("endDate")
    .select("amount")
    .select("createdAt")
    .then((invoice) => {
      console.log(invoice);
      res.status(202).json(invoice);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
