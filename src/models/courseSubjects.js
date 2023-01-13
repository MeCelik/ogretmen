const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseSubjectSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    grade: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Grade",
      required: true,
    },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const CourseSubject = model("CourseSubject", courseSubjectSchema);

module.exports = { CourseSubject };
