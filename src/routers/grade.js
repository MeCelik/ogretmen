const express = require("express");
const router = express.Router();
const { Grade } = require("../models/grades");
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
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.ders.trim())) {
        res.send("Grade must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, ders } = req.body;

      const existingGrade = await Grade.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingGrade.length !== 0) {
        res.send("This grade already exists");
        return;
      }
      const grade = new Grade({
        title,
        status,
        ders,
      });
      await grade.save();
      res.send(grade);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const gradeler = await Grade.find({});
    if (!gradeler) {
      res.status(404).send();
      return;
    }
    res.send(gradeler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      res.status(404).send();
      return;
    }
    res.send(grade);
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
        res.send("Grade must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, ders } = req.body;
      const grade = await Grade.findOneAndUpdate(
        req.params.id,
        {
          title,
          ders,
        },
        { new: true }
      );

      if (!grade) {
        res.status(404).send();
        return;
      }

      await grade.save();
      res.send(grade);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!grade) {
      res.status(404).send();
      return;
    }
    res.send(grade);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
