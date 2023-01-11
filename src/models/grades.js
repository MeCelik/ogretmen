const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gradeSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    ders: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Ders",
      required: true,
    },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const Grade = model("Grade", gradeSchema);

module.exports = { Grade };
