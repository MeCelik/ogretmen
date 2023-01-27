const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseWeekContentSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    courseWeek: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "CourseWeek",
      required: true,
    },
    achievement: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    subject: { type: String, trim: true, required: true },
    terms: { type: String, trim: true, required: true },
    notes: { type: String, trim: true, required: true },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const CourseWeekContent = model("CourseWeekContent", courseWeekContentSchema);

module.exports = { CourseWeekContent };
