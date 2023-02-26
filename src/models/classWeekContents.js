const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const classWeekContentSchema = new Schema(
  {
    week: { type: String, trim: true, required: true },
    title: { type: String, trim: true, required: true },
    // classSubject: {
    //   type: Schema.Types.ObjectId,
    //   trim: true,
    //   ref: "ClassSubject",
    //   required: true,
    // },
    gradeSubject: {
      type: Schema.Types.ObjectId,
      ref: "Grade",
      required: true,
    },
    achievement: { type: String, trim: true, required: true },
    // description: { type: String, trim: true, required: true },
    // subject: { type: String, trim: true, required: true },
    // terms: { type: String, trim: true, required: true },
    // notes: { type: String, trim: true, required: true },
    status: { type: Boolean, trim: true, default: true },
  },
  { timestamps: true }
);

const ClassWeekContent = model("ClassWeekContent", classWeekContentSchema);

module.exports = { ClassWeekContent };
