const cronAuth=async(req, res, next) =>{
  const authHeader = req.headers["x-cron-auth"];

  if (!authHeader || authHeader !== process.env.CRON_SECRET) {
    return res.status(403).json({ error: "Forbidden: invalid cron token" });
  }

  next(); // ✅ continue to the controller
}
module.exports = cronAuth;