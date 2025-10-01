const path = require("path");
const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require ("dotenv");
const routes=require('./routes/index.js')
const cookieParser =require("cookie-parser") ;
const cors = require("cors");
const app = express();

dotenv.config()
const allowedOrigins = [
  "http://localhost:5173",                 // local dev frontend
  "https://aimarketingproject-frontend.onrender.com",    // Render static site
  "https://meiryo.ca"       // optional custom domain
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
