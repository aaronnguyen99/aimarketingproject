const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../schema/UserModel.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    if(password.length<8){
        return res.status(400).json({ error: 'Password needs to be at least 8 character' })
    }
    const trialDays = 7;
    const user = new User({
      email,
      password,  // make sure this is hashed!
      name,
      tier: "free",  // optional, will default to "free" if omitted
      freeTrialEnds: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
    });

await user.save();
    

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      freeTrialEnds: user.freeTrialEnds
    }
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
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Get information
router.get("/info", auth, async (req, res) => {
  try {
    // Correct usage: pass the id directly, not an object
    const user = await User.findById(req.userId).select("name email tier freeTrialEnds phone organization address");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
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