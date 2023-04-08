const express = require("express");
const router = express.Router();
const { User } = require("../models/users");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { Transaction } = require("../models/transactions");

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post(
  "/",
  body("userType")
    .isLength({ min: 1 })
    .withMessage("Usertype must be either Admin or Employee"),
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("Firstname must be at least 1 char long"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Lastname must be at least 1 char long"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 char long and include at least 1 number, 1 lowercase char, 1 uppercase char and 1 symbol"
    ),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        userType,
        firstName,
        lastName,
        phoneNumber,
        password,
        email,
        status,
        premium,
      } = req.body;
      const existingUsers = await User.find({
        email: { $regex: new RegExp(email, "i") },
      });
      if (existingUsers.length !== 0) {
        res.send("This user already exists");
        return;
      }
      const user = new User({
        userType,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        status,
      });
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to login");
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).send();
    }
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch(
  "/me",
  body("userType")
    .isLength({ min: 1 })
    .withMessage("Usertype must be either Admin or Employee"),
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("Firstname must be at least 1 char long"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Lastname must be at least 1 char long"),
  body("phoneNumber")
    .isLength({ min: 1 })
    .withMessage("Phone number must be at least 1 char long"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 char long and include at least 1 number, 1 lowercase char, 1 uppercase char and 1 symbol"
    ),
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { userType, firstName, lastName, email, password } = req.body;

      const user = await User.findOneAndUpdate(
        req.user._id,
        {
          userType,
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).send();
      }

      await user.save();
      res.send(user);
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.delete("/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { status: false },
      { new: true }
    );
    if (!user) {
      res.status(404).send();
      return;
    }
    res.send(user);
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
});

module.exports = router;
