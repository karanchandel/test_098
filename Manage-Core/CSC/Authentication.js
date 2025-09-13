const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const CsCenter = require("../multiSchema/multischema"); 

// Registration route
router.post("/register", async (req, res) => {
  try {
    const {
      name, phone, email, cscID, password, Aadhar, PAN, CenterName, location,
      accountNumber, bankName, IFSC
    } = req.body;

    if (!name || !phone || !cscID || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const payload = {
      firstName: name,
      CSC_Id: cscID,
      phone,
      email,
      Aadhar,
      PAN,
      CenterName,
      location,
      bankDetails: {
        accountNumber,
        bankName,
        IFSC,
      },
      password: hashedPassword,
    };

    const existingUser = await CsCenter.findOne({ CSC_Id: cscID });
    if (existingUser) {
      return res.status(400).json({ error: "CSC_Id already exists" });
    }

    const user = new CsCenter(payload);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { ...user._doc, password: undefined }, // password not sent back
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { phone, cscID, password } = req.body;

    if (!phone || !cscID || !password) {
      return res.status(400).json({ error: "Phone, CSC_Id, and password are required" });
    }

    const user = await CsCenter.findOne({ phone: phone, CSC_Id: cscID });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Login successful
    return res.status(200).json({
      message: "Login successful",
      user: { ...user._doc, password: undefined }, // hide password
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
