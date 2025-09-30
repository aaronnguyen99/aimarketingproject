const express = require ("express");
const router=express.Router()
const PromptController=require('../controllers/PromptController');
const checkTier = require("../middleware/checkTier");
const checkPrompt = require("../middleware/checkPrompt");

router.post('/create',checkPrompt,PromptController.createPrompt)
router.get('/getall',PromptController.getAllPrompt)
router.delete('/delete/:id',PromptController.deletePrompt)
router.put('/update/:id',PromptController.updatePrompt)
router.post('/analyze',checkTier,PromptController.analyzeprompt)
router.get('/getlength',PromptController.getPromptLength)



module.exports=router