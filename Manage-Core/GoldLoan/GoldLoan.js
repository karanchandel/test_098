const express = require("express");
const router = express.Router();
const GoldLoan = require("../multiSchema/goldloan");

router.post("/apply", async (req, res) => {
  try {
    const { phone, email } = req.body;

    // 🔍 Check for existing application
    const existing = await GoldLoan.findOne({
      $or: [{ phone }, { email }]
    });

    if (existing) {
      return res.status(409).json({
        message: "Duplicate application detected",
        existing
      });
    }

    // ✅ Save new application
    const loan = new GoldLoan(req.body);
    await loan.save();
    res.status(201).json({ message: "Gold loan application submitted", loan });

  } catch (err) {
    console.error("GoldLoan error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;