const Prompt = require("../schema/PromptModel");
const User = require("../schema/UserModel");

const checkPrompt = async (req, res, next) => {
 const tierLimits = { 
  free: 10,     
  pro: 25,
  expired: 0
};   

  try {
    const user = await User.findById(req.userId);
    const promptCount = await Prompt.countDocuments({ userId: req.userId });
    const limit = tierLimits[user.tier] ?? 0;
    if (promptCount >= limit) {
      return res.status(403).json({ error: "Prompt limit reached. Upgrade to Pro." });
    }
  next();
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkPrompt;
