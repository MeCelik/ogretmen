const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const admin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("user not defined");
    }
    if (user.userType !== "Admin") {
      throw new Error("user not authorized");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("e", e);
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = admin;
