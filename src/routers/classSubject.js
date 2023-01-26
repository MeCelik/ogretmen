const express = require("express");
const router = express.Router();
const { ClassSubject } = require("../models/classSubjects");
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
      if (!mongoose.isValidObjectId(req.body.grade.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, grade } = req.body;

      const existingClassSubject = await ClassSubject.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingClassSubject.length !== 0) {
        res.send("This classSubject already exists");
        return;
      }
      const classSubject = new ClassSubject({
        title,
        grade,
        status,
      });
      await classSubject.save();
      res.send(classSubject);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classSubjectler = await ClassSubject.find({});
    if (!classSubjectler) {
      res.status(404).send();
      return;
    }
    res.send(classSubjectler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classSubject = await ClassSubject.findById(req.params.id);
    if (!classSubject) {
      res.status(404).send();
      return;
    }
    res.send(classSubject);
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
      if (!mongoose.isValidObjectId(req.body.grade.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, grade } = req.body;
      const classSubject = await ClassSubject.findOneAndUpdate(
        req.params.id,
        {
          title,
          grade,
        },
        { new: true }
      );

      if (!classSubject) {
        res.status(404).send();
        return;
      }

      await classSubject.save();
      res.send(classSubject);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classSubject = await ClassSubject.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classSubject) {
      res.status(404).send();
      return;
    }
    res.send(classSubject);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
