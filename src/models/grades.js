const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gradeSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    status: { type: Boolean, trim: true, default: true },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
  },
  { timestamps: true }
);

const Grade = model("Grade", gradeSchema);

module.exports = { Grade };
