const CompanyService=require('../services/CompanyService.js')

const createCompany=async(req,res)=>{
    try{
        const {name,domain}=req.body        

        if(!name)
        {
            return res.status(200).json({
                status:'Err',
                message:'The input is required expla'
            })
        }
        const response=await CompanyService.createCompany(req.body,req.userId)
        console.log('response',response)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const updateCompany=async(req,res)=>{
    try{
        const companyId=req.params.id
        const data=req.body
        if(!companyId||!data.name)
        {
            return res.status(200).json({
                status:'ERR',
                message:'companyId and name are required'
            })
        }
        const response=await CompanyService.updateCompany(companyId,data)
        console.log('response',response)

        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deleteCompany=async(req,res)=>{
    try{
        const companyId=req.params.id
        if(!companyId)
        {
            return res.status(200).json({
                status:'ERR',
                message:'companyId is required'
            })
        }
        const response=await CompanyService.deleteCompany(companyId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllCompany=async(req,res)=>{
    try{
        const response=await CompanyService.getAllCompany(req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports={
    createCompany,
    deleteCompany,
    updateCompany,
    getAllCompany
}