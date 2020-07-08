const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//connect DB

exports.dbOn = () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected Success");
  });

  return db;
};
