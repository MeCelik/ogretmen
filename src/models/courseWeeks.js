const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseWeekSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    courseSubject: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "CourseSubject",
      required: true,
    },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const CourseWeek = model("CourseWeek", courseWeekSchema);

module.exports = { CourseWeek };
