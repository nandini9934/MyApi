// models/postModel.js
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// 
// // Define a schema for data to be inserted by the POST API
// const user6Schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   signupdate: { type: Date, default: Date.now },
//   gender: String,
//   dob: String,
//   height: String,
//   weight: String,
//   medical: String,
//   goal: String,
//   bodyfat: String,
//   workout: String,
//   food: String,
//   occupation: String,
// });
// 
// user6Schema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
// 
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });
// 
// module.exports = mongoose.model("user6", user6Schema); // Model for the POST API
