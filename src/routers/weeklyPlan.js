const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { WeeklyPlan, DayOfWeek } = require("../models/weeklyPlan");
const { default: mongoose } = require("mongoose");
const { ClassModel } = require("../models/class");
const { ClassWeekContent } = require("../models/classWeekContents");
const { Grade } = require("../models/grades");

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
    const weeklyPlan = await WeeklyPlan.findOne({
      teacher: req.user.id,
    })
      .populate({
        path: "days",
        populate: {
          path: "classes",
          populate: {
            path: "class",
            model: "ClassModel",
          },
        },
      })
      .populate("days.classes.plan");
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
      return res.send(day);
    }
    const day = weeklyPlan.days.find((item) =>
      item.weekDay.equals(req.params.dayId)
    );
    res.send(day);
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
    const { classes } = req.body;
    const resSctructured = classes.map((item) => {
      return { ...item, class: mongoose.Types.ObjectId(item.class) };
    });
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      { teacher: req.user._id, "days.weekDay": req.params.dayId },
      { $set: { "days.$.classes": resSctructured } },
      { new: true }
    );
    res.send(weeklyPlan);
  } catch (error) {
    throw new Error(error);
  }
});
router.patch("/:dayId/push-class", auth, async (req, res) => {
  try {
    const { singleClass } = req.body;
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      { teacher: req.user._id, "days.weekDay": req.params.dayId },
      { $push: { "days.$.classes": singleClass } },
      { new: true }
    );
    res.send(weeklyPlan);
  } catch (error) {
    throw new Error(error);
  }
});
router.patch("/:dayId/update-class/:classId", auth, async (req, res) => {
  try {
    const { dayId, classId } = req.params;
    const { singleClass } = req.body;
    const temp = await WeeklyPlan.find({
      teacher: req.user._id,
      "days.weekDay": dayId,
      "days.classes._id": classId,
    });
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      {
        teacher: req.user._id,
        "days.weekDay": dayId,
      },
      { $set: { "days.$[].classes.$[classElem]": singleClass } },
      { arrayFilters: [{ "classElem._id": classId }], new: true }
    );
    res.send(weeklyPlan);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
router.get("/today", auth, async (req, res) => {
  try {
    const todayOrder = new Date().getDay();
    const today = await DayOfWeek.findOne({ order: todayOrder });
    const weekPlan = await WeeklyPlan.findOne({ teacher: req.user._id })
      .populate("days.classes.class")
      .populate("days.classes.plan")
      .lean();
    const todaysClass = weekPlan.days.find((item) =>
      item.weekDay.equals(today._id)
    );
    for (let i = 0; i < todaysClass.classes.length; i++) {
      const singleClass = todaysClass.classes[i];
      const grade = await Grade.findOne({
        planId: singleClass.plan._id,
        class: singleClass.class._id,
      });
      const classWeekContents = await ClassWeekContent.findOne({
        gradeSubject: grade._id,
      }).lean();
      singleClass.classWeekContents = classWeekContents;
    }
    res.send(todaysClass.classes);
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
router.get("/classes", async (req, res) => {
  try {
    const classes = await ClassModel.find({});
    res.send(classes);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
