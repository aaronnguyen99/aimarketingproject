const path = require("path");
const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require ("dotenv");
const routes=require('./routes/index.js')

dotenv.config()
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

// --- API route example ---
app.get("/api", (req, res) => {
  res.json({ message: "Hello from API!" });
});

mongoose.connect(`${process.env.MONGO_DB}`)
.then(()=>{
    console.log('Connect DB success')
})
.catch((err)=>{
    console.log(err)
})

// --- Serve React build files ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// --- Catch-all (for React Router SPA) ---
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
