const express = require("express");
const router = express.Router();
const { Grade } = require("../models/grades");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { ClassWeekContent } = require("../models/classWeekContents");

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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, planId } = req.body;

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
        planId,
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
    const grades = await Grade.find({});
    if (!grades) {
      res.status(404).send();
      return;
    }
    res.send(grades);
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
router.get("/:id/weeks", async (req, res) => {
  try {
    const weeks = await ClassWeekContent.find({ gradeSubject: req.params.id });
    if (!weeks) {
      res.status(404).send();
      return;
    }
    res.send(weeks);
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
      const grade = await Grade.findOneAndUpdate(req.params.id, req.body, {
        new: true,
      });

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
