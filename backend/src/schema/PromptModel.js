const mongoose=require('mongoose')
const promptSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content:{type:String,required:true},

    },
    {
        timestamps:true
    }

);
const Prompt=mongoose.model("Prompt",promptSchema);
module.exports=Prompt;