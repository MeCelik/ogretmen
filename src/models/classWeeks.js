const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const classWeekSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    classSubject: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "ClassSubject",
      required: true,
    },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const ClassWeek = model("ClassWeek", classWeekSchema);

module.exports = { ClassWeek };
