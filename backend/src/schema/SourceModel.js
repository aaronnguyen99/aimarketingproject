const mongoose=require('mongoose')
const sourceSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        url:{type:String,required:true},
        count:{type:Number,required:true},
    },
    {
        timestamps:true
    }

);


const Source=mongoose.model("Source",sourceSchema);
module.exports=Source;