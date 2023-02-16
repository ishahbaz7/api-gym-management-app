const TraineeInvoice = require("../models/traineeInvoiceModel");

exports.getTraineeInvoice = ({ userId }, req, res, next) => {
  const { id } = req?.params;

  TraineeInvoice.find({ traineeId: id, userId })
    .sort({ startDate: -1 })
    .then((traineeInv) => {
      res.status(202).json(traineeInv);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCollections = ({ userId }, req, res, next) => {
  const { sd, ed } = req.body;
  const d1 = new Date(sd);
  const d2 = new Date(ed);
  const start = new Date(d1.setHours(00, 00, 00));
  const end = new Date(d2.setHours(23, 59, 59));
  console.log(start, end);
  TraineeInvoice.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  })
    .select("amount")
    .select("startDate")
    .select("createdAt")
    .then((invoices) => {
      res.status(200).json(invoices);
    });
};

exports.deleteInvoice = ({ userId }, req, res, next) => {
  const { id } = req.params;

  TraineeInvoice.findOneAndDelete({ userId, _id: id })
    .then((result) => {
      res.status(202).json("ok");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getRemainingBalance = ({ userId }, req, res, next) => {
  TraineeInvoice.find({ userId, remainingBalance: { $gt: 0 } })
    .populate("traineeId", "name")
    .select("name")
    .select("amount")
    .select("remainingBalance")
    .select("traineeId")
    .select("startDate")
    .select("endDate")
    .select("membershipTitle")
    .then((invoices) => {
      console.log(invoices);
      res.status(200).json(invoices);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postRemainingBalance = ({ userId }, req, res, next) => {
  const {
    remainingBalance,
    invoiceId,
    traineeId,
    startDate,
    endDate,
    membershipTitle,
  } = req.body;
  console.log(remainingBalance, invoiceId);
  TraineeInvoice.create({
    amount: remainingBalance,
    userId,
    traineeId,
    startDate,
    endDate,
    membershipTitle,
  }).then((inv) => {
    TraineeInvoice.findOne({ userId, _id: invoiceId })
      .then((traineeInv) => {
        traineeInv.invoiceReferenceId.push(inv._id);
        traineeInv.remainingBalance =
          traineeInv.remainingBalance - remainingBalance || 0;
        traineeInv.save();
        return inv;
      })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        next(err);
      });
  });
};
