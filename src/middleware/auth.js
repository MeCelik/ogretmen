const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token", token);
    const decoded = jwt.verify(token, "thisismynewcourse");
    console.log("decoded", decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    console.log("user", user);
    if (!user) {
      throw new Error("user not defined");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("e", e);
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
