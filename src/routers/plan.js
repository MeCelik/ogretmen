const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const { Grade } = require("../models/grades");
const { Plan } = require("../models/plans");

router.post("/", admin, async (req, res) => {
  try {
    const plan = new Plan({ ...req.body });
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
    const grades = await Grade.find({ planId: req.params.id });
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

module.exports = router;
