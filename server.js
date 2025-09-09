require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  CSC_Id: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  Aadhar: { type: String },
  PAN: { type: String },
  CenterName: { type: String },
  location: { type: String },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    IFSC: { type: String },

  }
});

const User = mongoose.model("User", UserSchema);

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the CRM API 🚀");
});


app.post("/api/register", async (req, res) => {
  try {
    const users = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const user of users) {
      const { firstName, lastName, CSC_Id, phone, email, Aadhar, PAN, CenterName, location, bankDetails } = user;

      if (!CSC_Id || !firstName || !phone) {
        return res.status(400).json({
          success: false,
          error: "CSC_Id, firstName and phone are required fields",
        });
      }

      const updatedOrCreatedUser = await User.findOneAndUpdate(
        { CSC_Id },
        { firstName, lastName, phone, email, Aadhar, PAN, CenterName, location, bankDetails },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      results.push(updatedOrCreatedUser);
    }

    res.json({
      success: true,
      message: "Users registered/updated successfully",
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/api/csc-agent/details", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone parameter is required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
