const Analysis=  require("../schema/AnalysisModel")

const createAnalysis = async (userId,companyId,analysis) => {
    return new Promise(async(resolve,reject) => {

        try{
            const newAnalyze=await Analysis.create({
                userId,companyId,analysis
            })
            if(newAnalyze)
            {
                resolve({
                    status:'OK',
                    message:"Success",
                    data:newAnalyze
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
const getLastAnalysis= async(userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const last = await Analysis.findOne({ userId }).sort({ createdAt: -1 });
                resolve({
                    status:'OK',
                    message:"Get Last Nalysis Success",
                    data:last,
                })
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    createAnalysis,
    getLastAnalysis

}