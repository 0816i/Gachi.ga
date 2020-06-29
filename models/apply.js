const { request } = require("express");

const { Schema, model } = require("mongoose");

const ApplySchema = new Schema({
  travel_id: {
    type: String,
    required: true,
    trim: true,
  },
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
});
