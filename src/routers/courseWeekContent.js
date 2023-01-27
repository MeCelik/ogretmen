const express = require("express");
const router = express.Router();
const { CourseWeekContent } = require("../models/courseWeekContents");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
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
      if (!mongoose.isValidObjectId(req.body.courseWeek.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        courseWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      } = req.body;

      const existingCourseWeekContent = await CourseWeekContent.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingCourseWeekContent.length !== 0) {
        res.send("This courseWeekContent already exists");
        return;
      }
      const courseWeekContent = new CourseWeekContent({
        title,
        courseWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      });
      await courseWeekContent.save();
      res.send(courseWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const courseWeekContentler = await CourseWeekContent.find({});
    if (!courseWeekContentler) {
      res.status(404).send();
      return;
    }
    res.send(courseWeekContentler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseWeekContent = await CourseWeekContent.findById(req.params.id);
    if (!courseWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(courseWeekContent);
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
      if (!mongoose.isValidObjectId(req.body.courseWeek.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        courseWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
      } = req.body;
      const courseWeekContent = await CourseWeekContent.findOneAndUpdate(
        req.params.id,
        {
          title,
          achievement,
          description,
          subject,
          terms,
          notes,
          courseWeek,
        },
        { new: true }
      );

      if (!courseWeekContent) {
        res.status(404).send();
        return;
      }

      await courseWeekContent.save();
      res.send(courseWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const courseWeekContent = await CourseWeekContent.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!courseWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(courseWeekContent);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
