const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  id: { type: String, required: true },
  pw: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  grade: { type: Number, required: true, trim: true },
  klass: { type: Number, required: true, trim: true },
  number: { type: Number, required: true, trim: true },
  serial: { type: Number, required: true, trim: true },
});

module.exports = model("User", userSchema);
