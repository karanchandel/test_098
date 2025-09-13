// 📌 models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  CSC_Id: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  Aadhar: { type: String },
  PAN: { type: String },
  CenterName: { type: String },
  location: { type: String },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    IFSC: { type: String },
  },
});

module.exports = mongoose.model("CsCenter", UserSchema);
