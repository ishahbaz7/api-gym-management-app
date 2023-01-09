const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TraineeInvoiceSchema = new Schema(
  {
    traineeId: {
      require: true,
      type: Schema.Types.ObjectId,
      ref: "Trainee",
    },
    membershipId: {
      require: true,
      type: Schema.Types.ObjectId,
      ref: "Membership",
    },
    membershipTitle: {
      require: true,
      type: String,
    },
    amount: Number,
    startDate: {
      required: true,
      type: Date,
    },
    endDate: {
      require: true,
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
