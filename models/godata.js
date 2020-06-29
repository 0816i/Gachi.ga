const { Schema, model } = require("mongoose");

const GodataSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  dest: {
    type: String,
  },
  detail: {
    type: String,
    default: ".",
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  fill: {
    type: Number,
    required: true,
  },
  now: {
    type: Number,
    default: 1,
  },
  join: {
    type: Array,
    required: true,
  },
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = model("Godata", GodataSchema);
