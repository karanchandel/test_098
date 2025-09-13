const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Routes
const myRoutes = require("./Manage-Core/CSC/Authentication");
app.use("/api", myRoutes);

const Data = require("./Manage-Core/Data/demo");
app.use("/api/demo", Data);

app.get("/", (req, res) => {
  res.send("Hello server is Alive ");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
