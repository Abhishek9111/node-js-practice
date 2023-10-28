const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("connection to database established", connect.connection.host);
  } catch (err) {
    console.log("error", err);
    process.exit(1);
  }
};

module.exports = connectDb;
