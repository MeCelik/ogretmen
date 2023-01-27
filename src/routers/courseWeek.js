const express = require("express");
const router = express.Router();
const { CourseWeek } = require("../models/courseWeeks");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

router.post(
  "/",
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.courseSubject.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, courseSubject, status } = req.body;

      const existingCourseWeek = await CourseWeek.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingCourseWeek.length !== 0) {
        res.send("This courseWeek already exists");
        return;
      }
      const courseWeek = new CourseWeek({
        title,
        courseSubject,
        status,
      });
      await courseWeek.save();
      res.send(courseWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const courseWeekler = await CourseWeek.find({});
    if (!courseWeekler) {
      res.status(404).send();
      return;
    }
    res.send(courseWeekler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseWeek = await CourseWeek.findById(req.params.id);
    if (!courseWeek) {
      res.status(404).send();
      return;
    }
    res.send(courseWeek);
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
      if (!mongoose.isValidObjectId(req.body.courseSubject.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, courseSubject } = req.body;
      const courseWeek = await CourseWeek.findOneAndUpdate(
        req.params.id,
        {
          title,
          courseSubject,
        },
        { new: true }
      );

      if (!courseWeek) {
        res.status(404).send();
        return;
      }

      await courseWeek.save();
      res.send(courseWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const courseWeek = await CourseWeek.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!courseWeek) {
      res.status(404).send();
      return;
    }
    res.send(courseWeek);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
