const SourceService=require('../services/SourceService.js')

const getAllSource=async(req,res)=>{
    try{
         const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 20; 
        const response=await SourceService.getAllSource(req.userId,page,limit)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getTop5=async(req,res)=>{
    try{
        const response=await SourceService.getTop5(req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports={

    getAllSource,
    getTop5
}