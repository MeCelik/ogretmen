const express = require("express");
const router = express.Router();
const { CourseSubject } = require("../models/courseSubjects");
const { body, validationResult } = require("express-validator");
const auth = require("../midlleware/auth");
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
      if (!mongoose.isValidObjectId(req.body.grade.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, grade } = req.body;

      const existingCourseSubject = await CourseSubject.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingCourseSubject.length !== 0) {
        res.send("This courseSubject already exists");
        return;
      }
      const courseSubject = new CourseSubject({
        title,
        grade,
        status,
      });
      await courseSubject.save();
      res.send(courseSubject);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const courseSubjectler = await CourseSubject.find({});
    if (!courseSubjectler) {
      res.status(404).send();
      return;
    }
    res.send(courseSubjectler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseSubject = await CourseSubject.findById(req.params.id);
    if (!courseSubject) {
      res.status(404).send();
      return;
    }
    res.send(courseSubject);
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, grade } = req.body;
      const courseSubject = await CourseSubject.findOneAndUpdate(
        req.params.id,
        {
          title,
          grade,
        },
        { new: true }
      );

      if (!courseSubject) {
        res.status(404).send();
        return;
      }

      await courseSubject.save();
      res.send(courseSubject);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const courseSubject = await CourseSubject.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!courseSubject) {
      res.status(404).send();
      return;
    }
    res.send(courseSubject);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
