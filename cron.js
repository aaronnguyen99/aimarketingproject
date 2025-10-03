import crypto from "crypto";

const secret = crypto.randomBytes(32).toString("hex"); // 64-character hex string
console.log("Your cron secret:", secret);