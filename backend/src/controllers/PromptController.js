const PromptService=require('../services/PromptService.js')

const createPrompt=async(req,res)=>{
    try{
        const {content}=req.body        

        if(!content)
        {
            return res.status(200).json({
                status:'Err',
                message:'The input is required'
            })
        }
        const response=await PromptService.createPrompt(req.body,req.userId)
        console.log('response',response)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

const updatePrompt=async(req,res)=>{
    try{
        const promptId=req.params.id
        const data=req.body
        if(!promptId)
        {
            return res.status(200).json({
                status:'ERR',
                message:'promptId is required'
            })
        }
        const response=await PromptService.updatePrompt(promptId,data)
        console.log('response',response)

        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deletePrompt=async(req,res)=>{
    try{
        const promptId=req.params.id
        if(!promptId)
        {
            return res.status(200).json({
                status:'ERR',
                message:'promptId is required'
            })
        }
        const response=await PromptService.deletePrompt(promptId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllPrompt=async(req,res)=>{
    try{
        const response=await PromptService.getAllPrompt(req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports={
    createPrompt,
    updatePrompt,
    deletePrompt,
    getAllPrompt
}