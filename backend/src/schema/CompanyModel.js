const mongoose=require('mongoose')
const companySchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name:{type:String,required:true},
        domain:{type:String},
        isYourCompany:{type:Boolean,default:false},
        visibilityScore:{type:Number,default:0,required:true},
        count:{type:Number,default:0},
    },
    {
        timestamps:true
    }

);

companySchema.index(
  { isYourCompany: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { isYourCompany: true } 
  }
);


const Company=mongoose.model("Company",companySchema);
module.exports=Company;