// Manage-Core/HomeLoan.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Home Loan API is working"));
module.exports = router;