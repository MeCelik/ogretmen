const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Transaction } = require("../models/transactions");
const { body, validationResult } = require("express-validator");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

router.post(
  "/",
  body("cost")
    .isLength({ min: 1 })
    .withMessage("cost must be at least 1 char long"),
  body("customerId")
    .isLength({ min: 1 })
    .withMessage("customerId must be at least 1 char long"),
  body("status")
    .isLength({ min: 1 })
    .withMessage("status must be either true or false  long"),
  admin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.customerId.trim())) {
        res.send("customerId must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { cost, customerId, adminId, status, type } = req.body;

      const existingTransaction = await Transaction.find({
        customerId,
        type,
      });
      if (existingTransaction.length !== 0) {
        res.send("This transaction already exists");
        return;
      }
      const transaction = new Transaction({
        cost,
        customerId,
        adminId,
        status,
        type,
      });
      await transaction.save();
      res.send(transaction);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", admin, async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    if (!transactions) {
      res.status(404).send();
      return;
    }
    res.send(transactions);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/customer/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      customerId: req.params.id,
    });
    if (!transaction) {
      res.send(null);
      return;
    }
    res.send(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", admin, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      res.status(404).send();
      return;
    }
    res.send(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

router.patch("/:id", admin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const transaction = await Transaction.findOneAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!transaction) {
      res.status(404).send();
      return;
    }

    await transaction.save();
    res.send(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!transaction) {
      res.status(404).send();
      return;
    }
    res.send(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
