const express = require("express");
const router = express.Router();
const { ClassWeek } = require("../models/classWeeks");
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
      if (!mongoose.isValidObjectId(req.body.classSubject.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, classSubject, status } = req.body;

      const existingClassWeek = await ClassWeek.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingClassWeek.length !== 0) {
        res.send("This classWeek already exists");
        return;
      }
      const classWeek = new ClassWeek({
        title,
        classSubject,
        status,
      });
      await classWeek.save();
      res.send(classWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classWeeks = await ClassWeek.find({});
    if (!classWeeks) {
      res.status(404).send();
      return;
    }
    res.send(classWeeks);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classWeek = await ClassWeek.findById(req.params.id);
    if (!classWeek) {
      res.status(404).send();
      return;
    }
    res.send(classWeek);
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
      if (!mongoose.isValidObjectId(req.body.classSubject.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, classSubject } = req.body;
      const classWeek = await ClassWeek.findOneAndUpdate(
        req.params.id,
        {
          title,
          classSubject,
        },
        { new: true }
      );

      if (!classWeek) {
        res.status(404).send();
        return;
      }

      await classWeek.save();
      res.send(classWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classWeek = await ClassWeek.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classWeek) {
      res.status(404).send();
      return;
    }
    res.send(classWeek);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
