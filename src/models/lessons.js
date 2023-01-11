const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonSchema = new Schema(
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
    unit: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Unit",
      required: true,
    },
    grade: { type: String, trim: true, required: true },
    units: { type: String, trim: true, required: true },
    weeks: { type: Boolean, trim: true, default: true },
    achievement: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    subject: { type: String, trim: true, required: true },
    terms: { type: String, trim: true, required: true },
    notes: { type: String, trim: true, required: true },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const Lesson = model("Lesson", lessonSchema);

module.exports = { Lesson };
