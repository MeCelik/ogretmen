const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    cost: { type: String, trim: true, required: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "User",
      required: true,
    },
    status: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = { Transaction };
