const express = require ("express");
const router=express.Router()
const SourceController=require('../controllers/SourceController')

router.get('/getall',SourceController.getAllSource)
router.get('/gettop',SourceController.getTop5)



module.exports=router