const mongoose=require('mongoose')
const promptSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content:{type:String,required:true},
        snapshot:{type:String,default:"No existing snapshot."},
        count:{type:Number,default:0},
        snapshots: {
            gpt5: { type: String, default: "No existing snapshot." },     
            gemini: { type: String, default: "No existing snapshot." }    
            // you can add more models later
        },
    },
    {
        timestamps:true
    }

);
const Prompt=mongoose.model("Prompt",promptSchema);
module.exports=Prompt;