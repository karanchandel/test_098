const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const CsCenter = require("../multiSchema/multischema");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const {
      firstName, lastName, phone, email, username, password, Aadhar, PAN, CenterName, location,
      accountNumber, bankName, IFSC
    } = req.body;

    if (!firstName || !phone || !username || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const existingUser = await CsCenter.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const payload = {
      firstName,
      lastName,
      username,
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

    const user = new CsCenter(payload);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { phone, username, password } = req.body;

    if (!phone || !username || !password) {
      return res.status(400).json({ error: "Phone, username, and password are required" });
    }

    const user = await CsCenter.findOne({ phone, username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET user details by phone number
router.get("/detail/user-phone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const user = await CsCenter.findOne({ phone }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
