const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const unitWeekSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    courseUnit: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "CourseUnit",
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

const UnitWeek = model("UnitWeek", unitWeekSchema);

module.exports = { UnitWeek };
