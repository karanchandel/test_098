const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// ✅ MongoDB Connection
const MONGODB_URL = "mongodb://localhost:27017/CRM";

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Create Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model("User", UserSchema);

// Middleware - JSON body parse karega
app.use(express.json());

// ✅ GET API (All users list)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ POST API (Create user)
app.post("/api/user", async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ error: "Name and Age are required!" });
    }

    const newUser = new User({ name, age });
    await newUser.save();

    res.json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
