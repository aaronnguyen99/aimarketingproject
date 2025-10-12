const express = require ("express");
const router=express.Router()

const PromptController=require('../controllers/PromptController');
const ScoreController=require('../controllers/ScoreController');
const User = require('../schema/UserModel.js');
const pMapModule = require("p-map");
const pMap = pMapModule.default || pMapModule; 

router.post("/analyze", async (req, res) => {
  try {
    const now = new Date();

    const proUsers = await User.find({
    $or: [
        { tier: "pro" },
        { 
        $and: [
            { tier: "free" },
            { freeTrialEnds: { $gt: now } }  // free trial not expired yet
        ]
        }
    ]
    });
    const concurrency = 5;

    // Process analyzePrompt concurrently with p-map
    await pMap(proUsers, async (user) => {
    const fakeReq = { user, userId: user._id };
    const fakeRes = { json: () => {}, status: () => ({ json: () => {} }) };
    // await PromptController.analyzeprompt(fakeReq, fakeRes);
    await ScoreController.analyzeCompanyScores(fakeReq, fakeRes);
    }, { concurrency});

    res.json({ success: true, message: `Ran for ${proUsers.length} users` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cron failed" });
  }
});

module.exports=router