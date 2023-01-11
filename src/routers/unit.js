const express = require("express");
const router = express.Router();
const { Lesson } = require("../models/lessons");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../midlleware/auth");

router.post(
  "/",
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.ders.trim())) {
        res.send("Lesson must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, ders } = req.body;

      const existingLesson = await Lesson.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingLesson.length !== 0) {
        res.send("This lesson already exists");
        return;
      }
      const lesson = new Lesson({
        title,
        status,
        ders,
      });
      await lesson.save();
      res.send(lesson);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const lessonler = await Lesson.find({});
    if (!lessonler) {
      res.status(404).send();
      return;
    }
    res.send(lessonler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).send();
      return;
    }
    res.send(lesson);
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
      if (!mongoose.isValidObjectId(req.body.ders.trim())) {
        res.send("Lesson must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, ders } = req.body;
      const lesson = await Lesson.findOneAndUpdate(
        req.params.id,
        {
          title,
          ders,
        },
        { new: true }
      );

      if (!lesson) {
        res.status(404).send();
        return;
      }

      await lesson.save();
      res.send(lesson);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!lesson) {
      res.status(404).send();
      return;
    }
    res.send(lesson);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
