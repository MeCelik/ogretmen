const express = require("express");
const router = express.Router();
const { ClassWeekContent } = require("../models/classWeekContents");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

router.post(
  "/",
  // body("week")
  //   .isLength({ min: 1 })
  //   .withMessage("week must be at least 1 char long"),
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("achievement")
    .isLength({ min: 1 })
    .withMessage("achievement must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  // body("description")
  //   .isLength({ min: 1 })
  //   .withMessage("description must be at least 1 char long"),
  // body("subject")
  //   .isLength({ min: 1 })
  //   .withMessage("subject must be at least 1 char long"),
  // body("terms")
  //   .isLength({ min: 1 })
  //   .withMessage("terms must be at least 1 char long"),
  // body("notes")
  //   .isLength({ min: 1 })
  //   .withMessage("notes must be at least 1 char long"),

  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.gradeSubject)) {
        res.send("Class subject must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { week, title, gradeSubject, achievement, status, htmlVersion } =
        req.body;

      const existingClassWeekContent = await ClassWeekContent.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingClassWeekContent.length !== 0) {
        res.send("This Class week content already exists");
        return;
      }
      const classWeekContent = new ClassWeekContent({
        week,
        title,
        gradeSubject,
        achievement,
        status,
        htmlVersion,
      });
      await classWeekContent.save();
      res.send(classWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classWeekContents = await ClassWeekContent.find({});
    if (!classWeekContents) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContents);
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/current/:gradeId", async (req, res) => {
  try {
    const currentDate = new Date();
    const classWeekContents = await ClassWeekContent.findOne({
      gradeSubject: req.params.gradeId,
      $and: [
        { "week.start": { $lt: currentDate } },
        { "week.end": { $gt: currentDate } },
      ],
    });
    if (!classWeekContents) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContents);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classWeekContent = await ClassWeekContent.findById(req.params.id);
    if (!classWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContent);
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/:id/next", async (req, res) => {
  try {
    const currentWeek = await ClassWeekContent.findById(req.params.id);
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const nextW = new Date(currentWeek.week.value.getTime() + sevenDays);
    const nextWeek = await ClassWeekContent.findOne({
      gradeSubject: currentWeek.gradeSubject,
      $and: [{ "week.start": { $lt: nextW } }, { "week.end": { $gt: nextW } }],
    });
    if (!nextWeek) {
      res.status(404).send();
      return;
    }
    res.send(nextWeek);
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/:id/prev", async (req, res) => {
  try {
    const currentWeek = await ClassWeekContent.findById(req.params.id);
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const nextW = new Date(currentWeek.week.value.getTime() - sevenDays);
    const prevWeek = await ClassWeekContent.findOne({
      gradeSubject: currentWeek.gradeSubject,
      $and: [{ "week.start": { $lt: nextW } }, { "week.end": { $gt: nextW } }],
    });
    if (!prevWeek) {
      res.status(404).send();
      return;
    }
    res.send(prevWeek);
  } catch (error) {
    throw new Error(error);
  }
});

router.patch(
  "/:id",
  // body("week")
  //   .isLength({ min: 1 })
  //   .withMessage("week must be at least 1 char long"),
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("achievement")
    .isLength({ min: 1 })
    .withMessage("achievement must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.gradeSubject)) {
        res.send("Class subject must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { week, title, gradeSubject, achievement, status, htmlVersion } =
        req.body;
      console.log(req.params.id);
      const classWeekContent = await ClassWeekContent.findByIdAndUpdate(
        req.params.id,
        {
          week,
          title,
          gradeSubject,
          achievement,
          status,
          htmlVersion,
        },
        { new: true }
      );

      if (!classWeekContent) {
        res.status(404).send();
        return;
      }

      await classWeekContent.save();
      res.send(classWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classWeekContent = await ClassWeekContent.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContent);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
