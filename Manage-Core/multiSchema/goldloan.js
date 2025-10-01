const mongoose = require("mongoose");

const goldLoanSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  pincode: String,
  city: String,
  loanAmount: String,
  goldWeight: String,
  purity: String,
  karat: Number,
  pricePerGram: Number,
  employment: String,
  monthlyIncome: String,
  existingEMI: String,
  agree: Boolean,
}, { strict: false });

module.exports = mongoose.model("GoldLoan", goldLoanSchema);