const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { WeeklyPlan, DayOfWeek } = require("../models/weeklyPlan");

router.get("/mine", auth, async (req, res) => {
  try {
    const weeklyPlan = await WeeklyPlan.findOne({ teacher: req.user.id });
    if (!weeklyPlan) {
      const days = await DayOfWeek.find({});
      const newWeeklyPlan = new WeeklyPlan({
        days: days.map((singleDay) => {
          return {
            weekDay: singleDay.id,
            classes: [],
          };
        }),
        teacher: req.user.id,
      });
      await newWeeklyPlan.save();
      return res.send(newWeeklyPlan);
    }
    res.send(weeklyPlan);
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/mine/:dayId", auth, async (req, res) => {
  try {
    const weeklyPlan = await WeeklyPlan.findOne({ teacher: req.user.id });
    if (!weeklyPlan) {
      const days = await DayOfWeek.find({});
      const newWeeklyPlan = new WeeklyPlan({
        days: days.map((singleDay) => {
          return {
            weekDay: singleDay.id,
            classes: [],
          };
        }),
        teacher: req.user.id,
      });
      await newWeeklyPlan.save();
      const day = weeklyPlan.days.find((item) =>
        item.weekDay.equals(req.params.dayId)
      );
      console.log(weeklyPlan);
      return res.send(day);
    }
    res.send(weeklyPlan);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
router.get("/all", admin, async (req, res) => {
  try {
    res.send({});
  } catch (error) {
    throw new Error(error);
  }
});

router.patch("/:dayId", auth, async (req, res) => {
  try {
    console.log("TEST");
    const { classes } = req.body;
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      { teacher: req.user._id, "days.weekDay": req.params.dayId },
      { $set: { "days.$.classes": classes } },
      { new: true }
    );
    console.log(req.user._id);
    console.log(weeklyPlan);
    res.send(weeklyPlan);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/days", async (req, res) => {
  try {
    const days = await DayOfWeek.find({});
    res.send(days);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
