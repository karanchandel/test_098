const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  Aadhar: { type: String },
  PAN: { type: String },
  CenterName: { type: String },
  location: { type: String },
  accountNumber: { type: String },  
  bankName: { type: String },       
  IFSC: { type: String }            
});

module.exports = mongoose.model("CsCenter", UserSchema);