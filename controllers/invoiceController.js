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
  const start = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const end = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  TraineeInvoice.find({
    userId,
    startDate: { $gte: start, $lte: end },
  })
    .select("amount")
    .select("startDate")
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
