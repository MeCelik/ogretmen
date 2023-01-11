const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const unitSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    grade: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Grade",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Class",
      required: true,
    },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const Unit = model("Unit", unitSchema);

module.exports = { Unit };
