const express = require("express");
const router = express.Router();
const { Transaction } = require("../models/transactions");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  body("cost")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("carriedOut")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  body("status")
    .isBoolean()
    .withMessage("status must be either true or false  long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.fromUser.trim())) {
        res.send("fromUser must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { cost, carriedOut, status, fromUser } = req.body;

      const existingTransaction = await Transaction.find({
        title: { $regex: new RegExp(title.trim(), "i") },
      });
      if (existingTransaction.length !== 0) {
        res.send("This transaction already exists");
        return;
      }
      const transaction = new Transaction({
        cost,
        carriedOut,
        status,
        fromUser,
      });
      await transaction.save();
      res.send(transaction);
    } catch (error) {
      throw new Error(error);
    }
  }
);
router.get("/", auth, async (req, res) => {
  try {
    const transactionler = await Transaction.find({});
    if (!transactionler) {
      res.status(404).send();
      return;
    }
    res.send(transactionler);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", auth, async (req, res) => {
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

router.patch(
  "/:id",
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 char long"),
  auth,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.body.fromUser.trim())) {
        res.send("fromUser must be an ObjectId");
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title } = req.body;
      const transaction = await Transaction.findOneAndUpdate(
        req.params.id,
        {
          title,
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
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: false },
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
