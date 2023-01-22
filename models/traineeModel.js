const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TraineeSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: String,
    mobileNo: {
      required: true,
      type: String,
      unique: true,
    },
    address: String,
    profileImg: String,
    status: {
      required: true,
      type: String,
      default: "Active",
    },
    traineeInvoiceId: {
      type: Schema.Types.ObjectId,
      ref: "TraineeInvoice",
    },
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    membershipEndDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainee", TraineeSchema);
