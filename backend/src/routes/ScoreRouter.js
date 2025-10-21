const express = require ("express");
const router=express.Router()
const ScoreController=require('../controllers/ScoreController');
const checkTier = require("../middleware/checkTier");

router.post('/analyze',checkTier,ScoreController.analyzeCompanyScores)
router.get('/getdashboard',ScoreController.getScoreDashboard)
router.get('/getlast',ScoreController.getLastScore)
router.post('/analyzetext',ScoreController.analyzeText)


module.exports=router