const Company=  require("../schema/CompanyModel")

const createCompany = (newCompany,userId) => {
    return new Promise(async(resolve,reject) => {
        const {name,domain,isYour}=newCompany        

        try{
            if (isYour) {
                await Company.updateMany(
                    { userId: userId, isYour: true },
                    { $set: { isYour: false } }
                );
            }
            const newCompany=await Company.create({
                userId,name,domain,isYour
            })
            if(newCompany)
            {
                resolve({
                    status:'OK',
                    message:"Success",
                    data:newCompany
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
const updateCompany = (id,data,userId) => {
    return new Promise(async(resolve,reject) => {

        try{
            const checkCompany=await Company.findOne({
                _id: id
            })
            if(checkCompany===null)
            {
                resolve({
                    status:'OK',
                    message:"Company is not defined",
                })
            }
            if (data.isYour) {
                await Company.updateMany(
                    { userId: userId, isYour: true },
                    { $set: { isYour: false } }
                );
            }
            const updatedCompany= await Company.findByIdAndUpdate(id,data,{new:true})
                resolve({
                    status:'OK',
                    message:"Success",
                    data:updatedCompany

                })
        }catch(e){
            reject(e)
        }
    })
}
const deleteCompany = (id) => {
    return new Promise(async(resolve,reject) => {

        try{
            const company=await Company.findOne({
                _id: id
            })
            if(company===null)
            {
                resolve({
                    status:'OK',
                    message:"company is not defined",
                })
            }
            await Company.findByIdAndDelete(id)

                resolve({
                    status:'OK',
                    message:"Delete company Success"

                })
        }catch(e){
            reject(e)
        }
    })
}
const getAllCompany = (userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const allCompany=await Company.find({userId:userId})
                resolve({
                    status:'OK',
                    message:"Get All Company Success",
                    data:allCompany,
                })
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    createCompany,
    updateCompany,
    deleteCompany,
    getAllCompany
}