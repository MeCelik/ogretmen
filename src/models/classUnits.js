const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const unitSchema = new Schema(
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

const ClassUnit = model("ClassUnit", unitSchema);

module.exports = { ClassUnit };
