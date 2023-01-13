const express = require("express");
const router = express.Router();
const { CourseUnit } = require("../models/courseUnits");
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
      if (!mongoose.isValidObjectId(req.body.courseSubject.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, courseSubject, status } = req.body;

      const existingCourseUnit = await CourseUnit.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingCourseUnit.length !== 0) {
        res.send("This courseUnit already exists");
        return;
      }
      const courseUnit = new CourseUnit({
        title,
        courseSubject,
        status,
      });
      await courseUnit.save();
      res.send(courseUnit);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const courseUnitler = await CourseUnit.find({});
    if (!courseUnitler) {
      res.status(404).send();
      return;
    }
    res.send(courseUnitler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseUnit = await CourseUnit.findById(req.params.id);
    if (!courseUnit) {
      res.status(404).send();
      return;
    }
    res.send(courseUnit);
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
      const courseUnit = await CourseUnit.findOneAndUpdate(
        req.params.id,
        {
          title,
          courseSubject,
        },
        { new: true }
      );

      if (!courseUnit) {
        res.status(404).send();
        return;
      }

      await courseUnit.save();
      res.send(courseUnit);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const courseUnit = await CourseUnit.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!courseUnit) {
      res.status(404).send();
      return;
    }
    res.send(courseUnit);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
