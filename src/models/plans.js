const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const planSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const Plan = model("Plan", planSchema);

module.exports = { Plan };
