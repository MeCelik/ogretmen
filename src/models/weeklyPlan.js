const { ClassModel } = require("./class");

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dayOfWeekSchema = new Schema({
  title: {
    type: String,
  },
  order: {
    type: Number,
  },
});
const DayOfWeek = model("dayOfWeek", dayOfWeekSchema);

const singleClass = new Schema({
  class: {
    type: Schema.Types.ObjectId,
    ref: "ClassModel",
  },
  start: {
    type: Number,
  },
  end: {
    type: Number,
  },
  title: {
    type: String,
  },
});
const daySchema = new Schema({
  weekDay: {
    type: Schema.Types.ObjectId,
    ref: "DayOfWeek",
    required: true,
  },
  classes: [singleClass],
});

const weeklyPlanSchema = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    days: [daySchema],
  },
  { timestamps: true }
);

const WeeklyPlan = model("WeeklyPlan", weeklyPlanSchema);

module.exports = { WeeklyPlan, DayOfWeek };
