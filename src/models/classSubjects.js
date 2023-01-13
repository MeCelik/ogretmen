const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const classSubjectSchema = new Schema(
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

const ClassSubject = model("ClassSubject", classSubjectSchema);

module.exports = { ClassSubject };
