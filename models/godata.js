const mongoose = require("mongoose");

const GodataSchema = new mongoose.Schema({
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
        default: Date.now,
    },
    detail: {
        type: String
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
    joiner: {
        type: Array,
        required:true,
    }
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("Godata", GodataSchema);