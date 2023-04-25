const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const classSchema = new Schema({
  title: {
    type: String,
  },
  order: {
    type: Number,
  },
});

const ClassModel = model("ClassModel", classSchema);
module.exports = { ClassModel };

const siniflar = [
  "1. Sınıf",
  "2. Sınıf",
  "3. Sınıf",
  "4. Sınıf",
  "5. Sınıf",
  "6. Sınıf",
  "7. Sınıf",
  "8. Sınıf",
  "9. Sınıf",
  "10. Sınıf",
  "11. Sınıf",
  "12. Sınıf",
];

const main = async () => {
  for (let i = 0; i < siniflar.length; i++) {
    const element = siniflar[i];
    const classModel = new ClassModel({
      title: element,
      order: i,
    });
    await classModel.save();
  }
};
main();
