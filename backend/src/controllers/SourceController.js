const SourceService=require('../services/SourceService.js')

const getAllSource=async(req,res)=>{
    try{
        const response=await SourceService.getAllSource(req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports={

    getAllSource
}