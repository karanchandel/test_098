const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const CsCenter = require("../multiSchema/multischema");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      phone,
      email,
      password,
      Aadhar,
      PAN,
      CenterName,
      location,
      accountNumber,
      bankName,
      IFSC,
    } = req.body;

    // ✅ Required field check
    if (!firstName || !phone || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // ✅ Auto-generate username (firstName + random digits)
    const baseName = firstName.toLowerCase().replace(/\s+/g, "");
    let username = `${baseName}${Math.floor(1000 + Math.random() * 9000)}`;

    // Ensure username is unique
    while (await CsCenter.findOne({ username })) {
      username = `${baseName}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // ✅ Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Prepare payload (no lastName now)
    const payload = {
      firstName,
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

    // ✅ Save user
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
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ error: "Email or username and password are required" });
    }

    // ✅ Find user by email OR username
    const user = await CsCenter.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

  return res.status(200).json({
  message: "Login successful",
  role: "CSC",
  user: {
    username: user.username,
    email: user.email,
  },
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
