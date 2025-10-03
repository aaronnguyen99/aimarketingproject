import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function runCron() {
  const res = await fetch(`https://aimarketingproject.onrender.com/api/cron/analyze`, {
    method: "POST",
    headers: { "x-cron-auth": process.env.CRON_SECRET }
  });
  const data = await res.json();
  console.log(data);
}

runCron().catch(console.error);