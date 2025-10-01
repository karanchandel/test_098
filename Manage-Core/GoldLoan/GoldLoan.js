const express = require("express");
const router = express.Router();
const GoldLoan = require("../multiSchema/goldloan");

router.post("/apply", async (req, res) => {
  try {
    const payload = req.body;
    const loan = new GoldLoan(payload);
    await loan.save();
    res.status(201).json({ message: "Gold loan application submitted", loan });
  } catch (err) {
    console.error("GoldLoan error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;