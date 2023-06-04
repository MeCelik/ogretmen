const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const { Grade } = require("../models/grades");
const { Plan } = require("../models/plans");
const { ClassModel } = require("../models/class");
const auth = require("../middleware/auth");
const { ClassWeekContent } = require("../models/classWeekContents");

router.post("/", admin, async (req, res) => {
  try {
    const plan = new Plan({ ...req.body });
    const classes = await ClassModel.find({});
    console.log(classes);
    for (let i = 0; i < classes.length; i++) {
      const singleClass = classes[i];
      const grade = new Grade({
        status: true,
        planId: plan._id,
        class: singleClass._id,
      });
      await grade.save();
    }
    await plan.save();
    res.send(plan);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.send(plans);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {});
router.get("/:id/grades", admin, async (req, res) => {
  try {
    const grades = await Grade.find({ planId: req.params.id }).populate(
      "class"
    );
    res.send(grades);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.get("/:id/customer-grades", auth, async (req, res) => {
  try {
    const grades = await Grade.find({
      planId: req.params.id,
      status: true,
    }).populate("class");
    res.send(grades);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.patch("/:id", admin, async (req, res) => {
  try {
    const plans = await Plan.findByIdAndUpdate(req.params.id, { ...req.body });
    res.send(plans);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.delete("/:id", admin, async (req, res) => {});

router.get("/class/:classId", async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.send(plans);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.get("/achievement/:classId/:planId", async (req, res) => {
  try {
    const { classId, planId } = req.params;
    const grade = await Grade.findOne({ class: classId, planId });
    const classWeekContents = await ClassWeekContent.find({
      gradeSubject: grade._id,
    });
    res.send(classWeekContents);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
