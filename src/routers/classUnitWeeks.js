const express = require("express");
const router = express.Router();
const { ClassUnitWeek } = require("../models/classUnitWeeks");
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
      if (!mongoose.isValidObjectId(req.body.classUnit.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        classUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      } = req.body;

      const existingClassUnitWeek = await ClassUnitWeek.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingClassUnitWeek.length !== 0) {
        res.send("This classUnitWeek already exists");
        return;
      }
      const classUnitWeek = new ClassUnitWeek({
        title,
        classUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      });
      await classUnitWeek.save();
      res.send(classUnitWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classUnitWeekler = await ClassUnitWeek.find({});
    if (!classUnitWeekler) {
      res.status(404).send();
      return;
    }
    res.send(classUnitWeekler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classUnitWeek = await ClassUnitWeek.findById(req.params.id);
    if (!classUnitWeek) {
      res.status(404).send();
      return;
    }
    res.send(classUnitWeek);
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
      if (!mongoose.isValidObjectId(req.body.classUnit.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        classUnit,
        achievement,
        description,
        subject,
        terms,
        notes,
      } = req.body;
      const classUnitWeek = await ClassUnitWeek.findOneAndUpdate(
        req.params.id,
        {
          title,
          achievement,
          description,
          subject,
          terms,
          notes,
          classUnit,
        },
        { new: true }
      );

      if (!classUnitWeek) {
        res.status(404).send();
        return;
      }

      await classUnitWeek.save();
      res.send(classUnitWeek);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classUnitWeek = await ClassUnitWeek.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classUnitWeek) {
      res.status(404).send();
      return;
    }
    res.send(classUnitWeek);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
