const mongoose = require("mongoose");
const { model } = require("./godata");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pw: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  grade: { type: Number, required: true, trim: true },
  klass: { type: Number, required: true, trim: true },
  number: { type: Number, required: true, trim: true },
  serial: { type: Number, required: true, trim: true },
});

module.exports = mongoose.model("User", userSchema);
