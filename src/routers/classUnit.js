const express = require("express");
const router = express.Router();
const { ClassUnit } = require("../models/classUnits");
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

      const existingClassUnit = await ClassUnit.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingClassUnit.length !== 0) {
        res.send("This classUnit already exists");
        return;
      }
      const classUnit = new ClassUnit({
        title,
        classSubject,
        status,
      });
      await classUnit.save();
      res.send(classUnit);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classUnitler = await ClassUnit.find({});
    if (!classUnitler) {
      res.status(404).send();
      return;
    }
    res.send(classUnitler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classUnit = await ClassUnit.findById(req.params.id);
    if (!classUnit) {
      res.status(404).send();
      return;
    }
    res.send(classUnit);
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
      const classUnit = await ClassUnit.findOneAndUpdate(
        req.params.id,
        {
          title,
          classSubject,
        },
        { new: true }
      );

      if (!classUnit) {
        res.status(404).send();
        return;
      }

      await classUnit.save();
      res.send(classUnit);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classUnit = await ClassUnit.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classUnit) {
      res.status(404).send();
      return;
    }
    res.send(classUnit);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
