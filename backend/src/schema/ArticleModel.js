const mongoose=require('mongoose')
const articleSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
        url:{type:String,required:true}
    },
    {
        timestamps:true
    }

);


const Article=mongoose.model("Article",articleSchema);
module.exports=Article;