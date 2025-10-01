const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../schema/UserModel.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 8 characters" });
    }

    const trialDays = 7;
    const user = new User({
      email,
      password, // schema pre-save hook hashes it
      name,
      tier: "free",
      freeTrialEnds: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
    });

    await user.save();

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true in production with HTTPS
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user only
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        freeTrialEnds: user.freeTrialEnds,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{ expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // false on localhost
      secure:true,
      sameSite: "none", // can be "strict" if frontend/backend same origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // false on localhost
      secure:true,
      sameSite: "none" // can be "strict" if frontend/backend same origin
    });
  res.json({ message: "Logged out" });
});

router.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email tier freeTrialEnds phone organization address");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/update", auth, async (req, res) => {
  const { name, phone,organization, address} = req.body;
  console.log("test");
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone,organization, address },
      { new: true, runValidators: true } // return updated document
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});
module.exports = router;