const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const MembershipSchema = new Schema(
  {
    membershipTitle: {
      required: true,
      type: String,
    },
    amount: {
      required: true,
      type: Number,
    },
    pkg: {
      required: true,
      type: String,
    },
    description: String,
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);
