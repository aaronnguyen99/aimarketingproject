const UserModel = require("../schema/UserModel");

const checkTier = async (req, res, next) => {
  const user = await UserModel.findById(req.userId);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (user.tier === "expired") {
    return res.status(403).json({ error: "Your plan has expired. Please upgrade." });
  }

  if (user.tier === "free" && user.freeTrialEnds && user.freeTrialEnds < Date.now()) {
    user.tier = "expired";
    await user.save();
    return res.status(403).json({ error: "Your free trial has expired. Please upgrade." });
  }

  next();
};

module.exports = checkTier;
