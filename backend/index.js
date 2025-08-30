const path = require("path");
const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors());
// --- API route example ---
app.get("/api", (req, res) => {
  res.json({ message: "Hello from API!" });
});

// --- Serve React build files ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// --- Catch-all (for React Router SPA) ---
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
