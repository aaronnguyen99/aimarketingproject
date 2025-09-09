const express = require ("express");
const router=express.Router()
const ScoreController=require('../controllers/ScoreController')

router.post('/create',ScoreController.createScore)
router.get('/getaverage',ScoreController.getAverageScore)
router.post('/analyze',ScoreController.analyzeCompanyScores)
router.get('/getlast',ScoreController.getLastScore)
router.get('/getdashboard',ScoreController.getScoreDashboard)



module.exports=router