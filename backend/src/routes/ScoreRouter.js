const express = require ("express");
const router=express.Router()
const ScoreController=require('../controllers/ScoreController')

router.post('/create',ScoreController.createScore)
router.post('/analyze',ScoreController.analyzeCompanyScores)
router.get('/getdashboard',ScoreController.getScoreDashboard)
router.get('/getlast',ScoreController.getLastScore)



module.exports=router