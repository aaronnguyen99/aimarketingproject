const mongoose=require('mongoose')
const companySchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name:{type:String,required:true},
        domain:{type:String},
    },
    {
        timestamps:true
    }

);


const Company=mongoose.model("Company",companySchema);
module.exports=Company;