const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TraineeInvoiceSchema = new Schema(
  {
    traineeId: {
      type: Schema.Types.ObjectId,
      ref: "Trainee",
    },
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
    },
    membershipTitle: {
      type: String,
    },
    amount: {
      required: true,
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    remainingBalance: Number,
    invoiceReferenceId: {
      type: [Schema.Types.ObjectId],
      ref: "TraineeInvoice",
    },
    endDate: {
      type: Date,
    },
    membershipId: {
      type: mongoose.Types.ObjectId,
      ref: "Membership",
    },
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("TraineeInvoice", TraineeInvoiceSchema);
