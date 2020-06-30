const { Schema, model } = require("mongoose");

const GodataSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  serial: { type: String, required: true },
  detail: { type: String },
  dest: { type: String, required: true },
  date: { type: Date, required: true },
  join: { type: Array, required: true },
  fill: { type: Number, required: true },
  now: { type: Number, default: 1 },
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = model("Godata", GodataSchema);
