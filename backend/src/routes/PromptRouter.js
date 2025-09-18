const express = require ("express");
const router=express.Router()
const PromptController=require('../controllers/PromptController')

router.post('/create',PromptController.createPrompt)
router.get('/getall',PromptController.getAllPrompt)
router.delete('/delete/:id',PromptController.deletePrompt)
router.put('/update/:id',PromptController.updatePrompt)
router.post('/analyze',PromptController.analyzeprompt)
router.get('/getlength',PromptController.getPromptLength)



module.exports=router