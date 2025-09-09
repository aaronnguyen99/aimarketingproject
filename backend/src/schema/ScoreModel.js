const mongoose=require('mongoose')
const scoreSchema=new mongoose.Schema(
    {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
        promptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
        visible: {type: Boolean,required: true,default:false},
        position:{type:Number,required: true,default:0}
    },
    {
        timestamps:true
    }

);
const Score=mongoose.model("Score",scoreSchema);
module.exports=Score;