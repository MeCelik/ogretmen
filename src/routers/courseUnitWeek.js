const express = require("express");
const router = express.Router();
const { CourseUnitWeek } = require("../models/courseUnitWeeks");
const { body, validationResult } = require("express-validator");
const auth = require("../midlleware/auth");
const mongoose = require("mongoose");

router.post(
  "/",
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("achievement")
    .isLength({ min: 1 })
    .withMessage("achievement must be at least 1 char long"),
  body("description")
    .isLength({ min: 1 })
    .withMessage("description must be at least 1 char long"),
  body("subject")
    .isLength({ min: 1 })
    .withMessage("subject must be at least 1 char long"),
  body("terms")
    .isLength({ min: 1 })
    .withMessage("terms must be at least 1 char long"),
  body("notes")
    .isLength({ min: 1 })
    .withMessage("notes must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.courseUnit.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        courseUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      } = req.body;

      const existingCourseUnitWeek = await CourseUnitWeek.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingCourseUnitWeek.length !== 0) {
        res.send("This courseUnitWeek already exists");
        return;
      }
      const courseUnitWeek = new CourseUnitWeek({
        title,
        courseUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      });
      await courseUnitWeek.save();
      res.send(courseUnitWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const courseUnitWeekler = await CourseUnitWeek.find({});
    if (!courseUnitWeekler) {
      res.status(404).send();
      return;
    }
    res.send(courseUnitWeekler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseUnitWeek = await CourseUnitWeek.findById(req.params.id);
    if (!courseUnitWeek) {
      res.status(404).send();
      return;
    }
    res.send(courseUnitWeek);
  } catch (error) {
    throw new Error(error);
  }
});

router.patch(
  "/:id",
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.courseUnit.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        courseUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
      } = req.body;
      const courseUnitWeek = await CourseUnitWeek.findOneAndUpdate(
        req.params.id,
        {
          title,
          achievement,
          description,
          subject,
          terms,
          notes,
          courseUnit,
        },
        { new: true }
      );

      if (!courseUnitWeek) {
        res.status(404).send();
        return;
      }

      await courseUnitWeek.save();
      res.send(courseUnitWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const courseUnitWeek = await CourseUnitWeek.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!courseUnitWeek) {
      res.status(404).send();
      return;
    }
    res.send(courseUnitWeek);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
