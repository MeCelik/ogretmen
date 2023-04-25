const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { WeeklyPlan, DayOfWeek } = require("../models/weeklyPlan");

router.get("/mine", auth, async (req, res) => {
  try {
    const weeklyPlan = await WeeklyPlan.findOne({ teachler: req.user.id });
    if (!weeklyPlan) {
      const days = await DayOfWeek.find({});
      const newWeeklyPlan = new WeeklyPlan({
        days: days.map((singleDay) => {
          return {
            weekDay: singleDay.id,
            classes: [],
          };
        }),
        teachler: req.user.id,
      });
      await newWeeklyPlan.save();
      return res.send(newWeeklyPlan);
    }
    res.send(weeklyPlan);
  } catch (error) {
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

router.patch("/:id/:dayId", auth, async (req, res) => {
  try {
    const { classes } = req.body;
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      { teachler: req.user.id, "days._id": req.params.dayId },
      { $set: { "days.$.classes": classes } },
      { new: true }
    );
    res.send(weeklyPlan);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
