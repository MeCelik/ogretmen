const express = require("express");
require("dotenv").config();
const classSubjects = require("./routers/classSubject");
const classUnits = require("./routers/classUnit");
const classUnitWeeks = require("./routers/classUnitWeeks");
const grades = require("./routers/grade");
const users = require("./routers/user");

const app = express();
app.use(express.json());
// app.use("/classSubjects", classSubjects);
// app.use("/classUnits", classUnits);
// app.use("/classUnitWeeks", classUnitWeeks);
// app.use("/grades", grades);
app.use("/users", users);

app.get("/", (req, res) => {
  res.send("not found");
});
app.all("*", (req, res) => {
  res.send("not found");
});

const mongoose = require("mongoose");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("Connected to Database Successfully");
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
