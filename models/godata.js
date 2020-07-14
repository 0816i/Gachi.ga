const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  serial: { type: String, required: true },
});

const GodataSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  serial: { type: String, required: true },
  detail: { type: String },
  dest: { type: String, required: true },
  date: { type: Date, required: true },
  join: { type: [UserSchema], required: true },
  fill: { type: Number, required: true },
  now: { type: Number, default: 1 },
});

module.exports = model("Godata", GodataSchema);
