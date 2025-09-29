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

    // ✅ Check for existing phone or email
    const existingUser = await CsCenter.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({
        error: "Phone or email already registered",
      });
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

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Find user by email only
    const user = await CsCenter.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
      role: "csc",
      message: "CSC partner logged in",
      username: user.username,
    });

  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});



// GET user details by phone or username
router.get("/detail/user/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;

    // Check if identifier is a phone number (all digits)
    const isPhone = /^\d{10}$/.test(identifier);

    const query = isPhone ? { phone: identifier } : { username: identifier };

    const user = await CsCenter.findOne(query).select("-password");

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
