const express = require("express");
const router = express.Router();
const { ClassWeekContent } = require("../models/classWeekContents");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

router.post(
  "/",
  // body("title")
  //   .isLength({ min: 1 })
  //   .withMessage("title must be at least 1 char long"),
  // body("achievement")
  //   .isLength({ min: 1 })
  //   .withMessage("achievement must be at least 1 char long"),
  // body("description")
  //   .isLength({ min: 1 })
  //   .withMessage("description must be at least 1 char long"),
  // body("subject")
  //   .isLength({ min: 1 })
  //   .withMessage("subject must be at least 1 char long"),
  // body("terms")
  //   .isLength({ min: 1 })
  //   .withMessage("terms must be at least 1 char long"),
  // body("notes")
  //   .isLength({ min: 1 })
  //   .withMessage("notes must be at least 1 char long"),
  // body("status")
  //   .isBoolean()
  //   .withMessage("status must be either true or false  long"),
  // auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.classWeek.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      // }
      const {
        title,
        classWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      } = req.body;
      console.log(
        title,
        classWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
        status
      );
      // const existingClassWeekContent = await ClassWeekContent.find({
      //   title: { $regex: new RegExp(title.trim(), "i") },
      // });
      // if (existingClassWeekContent.length !== 0) {
      //   res.send("This classWeekContent already exists");
      //   return;
      // }
      const classWeekContent = new ClassWeekContent({
        title,
        classWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
        status,
      });
      await classWeekContent.save();
      res.send(classWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const classWeekContentler = await ClassWeekContent.find({});
    if (!classWeekContentler) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContentler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classWeekContent = await ClassWeekContent.findById(req.params.id);
    if (!classWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContent);
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
      if (!mongoose.isValidObjectId(req.body.classWeek.trim())) {
        res.send("Category must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        classWeek,
        achievement,
        description,
        subject,
        terms,
        notes,
      } = req.body;
      const classWeekContent = await ClassWeekContent.findOneAndUpdate(
        req.params.id,
        {
          title,
          achievement,
          description,
          subject,
          terms,
          notes,
          classWeek,
        },
        { new: true }
      );

      if (!classWeekContent) {
        res.status(404).send();
        return;
      }

      await classWeekContent.save();
      res.send(classWeekContent);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const classWeekContent = await ClassWeekContent.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!classWeekContent) {
      res.status(404).send();
      return;
    }
    res.send(classWeekContent);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
