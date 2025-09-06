const mongoose=require('mongoose')
const promptSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content:{type:String,required:true},
        snapshot:{type:String,default:"No existing snapshot."},

    },
    {
        timestamps:true
    }

);
const Prompt=mongoose.model("Prompt",promptSchema);
module.exports=Prompt;