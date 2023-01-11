const express = require("express");
const router = express.Router();
const { Ders } = require("../models/dersler");
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
      if (!mongoose.isValidObjectId(req.body.grade.trim())) {
        res.send("Grade must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, status, grade } = req.body;

      const existingDers = await Ders.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingDers.length !== 0) {
        res.send("This ders already exists");
        return;
      }
      const ders = new Ders({
        title,
        status,
        grade,
      });
      await ders.save();
      res.send(ders);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const dersler = await Ders.find({});
    if (!dersler) {
      res.status(404).send();
      return;
    }
    res.send(dersler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ders = await Ders.findById(req.params.id);
    if (!ders) {
      res.status(404).send();
      return;
    }
    res.send(ders);
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
        res.send("Grade must be an ObjectId");
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, grade } = req.body;
      const ders = await Ders.findOneAndUpdate(
        req.params.id,
        {
          title,
          grade,
        },
        { new: true }
      );

      if (!ders) {
        res.status(404).send();
        return;
      }

      await ders.save();
      res.send(ders);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const ders = await Ders.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!ders) {
      res.status(404).send();
      return;
    }
    res.send(ders);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
