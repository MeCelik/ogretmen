const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    cost: { type: String, trim: true, required: true },
    carriedOut: { type: Boolean, trim: true },
    status: { type: Boolean, trim: true, default: true },
    fromUser: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = { Transaction };
