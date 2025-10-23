const mongoose=require('mongoose')
const analysisSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
        analysis: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    {
        timestamps:true
    }

);
const Analysis=mongoose.model("Analysis",analysisSchema);
module.exports=Analysis;