const Prompt=  require("../schema/PromptModel")

const createPrompt = (newPrompt,userId) => {
    return new Promise(async(resolve,reject) => {
        const {content,geo}=newPrompt        

        try{
            const newPrompt=await Prompt.create({
                userId,content,geo
            })
            if(newPrompt)
            {
                resolve({
                    status:'OK',
                    message:"Success",
                    data:newPrompt
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
const updatePrompt = (id,data) => {
    return new Promise(async(resolve,reject) => {

        try{
            const checkPrompt=await Prompt.findOne({
                _id: id
            })
            if(checkPrompt===null)
            {
                resolve({
                    status:'OK',
                    message:"Prompt is not defined",
                })
            }
            const updatedPrompt= await Prompt.findByIdAndUpdate(id,data,{new:true})
                resolve({
                    status:'OK',
                    message:"Success",
                    data:updatedPrompt

                })
        }catch(e){
            reject(e)
        }
    })
}
const deletePrompt = (id) => {
    return new Promise(async(resolve,reject) => {

        try{
            const prompt=await Prompt.findOne({
                _id: id
            })
            if(prompt===null)
            {
                resolve({
                    status:'OK',
                    message:"prompt is not defined",
                })
            }
            await Prompt.findByIdAndDelete(id)

                resolve({
                    status:'OK',
                    message:"Delete prompt Success"

                })
        }catch(e){
            reject(e)
        }
    })
}
const getAllPrompt = (userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const allPrompt=await Prompt.find({userId: userId})
                resolve({
                    status:'OK',
                    message:"Get All Prompt Success",
                    data:allPrompt,
                })
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    createPrompt,
    updatePrompt,
    deletePrompt,
    getAllPrompt
}