const express = require ("express");
const router=express.Router()
const ScoreController=require('../controllers/ScoreController')

router.post('/create',ScoreController.createScore)
router.get('/getallprompt',ScoreController.getAllScorePrompt)


module.exports=router