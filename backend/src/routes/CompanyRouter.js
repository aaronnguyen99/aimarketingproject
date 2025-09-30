const express = require ("express");
const router=express.Router()
const CompanyController=require('../controllers/CompanyController')

router.post('/create',CompanyController.createCompany)
router.get('/getall',CompanyController.getAllCompany)
router.delete('/delete/:id',CompanyController.deleteCompany)
router.put('/update/:id',CompanyController.updateCompany)


module.exports=router