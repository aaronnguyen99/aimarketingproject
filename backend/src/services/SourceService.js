const Source=  require("../schema/SourceModel")

const createSource = (userId,newSource) => {
    return new Promise(async(resolve,reject) => {
        const {url,count}=newSource        

        try{
            const newSource=await Source.create({
                userId,url,count
            })
            if(newSource)
            {
                resolve({
                    status:'OK',
                    message:"Success",
                    data:newSource
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
const getAllSource = (userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const allSource=await Source.find({userId:userId})
                resolve({
                    status:'OK',
                    message:"Get All Source Success",
                    data:allSource,
                })
        }catch(e){
            reject(e)
        }
    })
}
const getTop5 = (userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const topSources = await Source.find({ userId }) // filter by user
            .sort({ count: -1 })  // sort by count descending
            .limit(5);  
                resolve({
                    status:'OK',
                    message:"Get Top Source Success",
                    data:topSources,
                })
        }catch(e){
            reject(e)
        }
    })
}
const update = async (userId, url) => {
    const existing = await Source.findOne({ url });
    
    if (existing) {
        return await Source.findByIdAndUpdate(
            existing._id,
            { $inc: { count: 1 } },
            { new: true }
        );
    } else {
        return await Source.create({
            userId,
            url,
            count: 1
        });
    }
};
const updateArticle = async (userId, url) => {
    const existing = await Source.findOne({ url });
    
    if (existing) {
        return await Source.findByIdAndUpdate(
            existing._id,
            { $inc: { count: 1 } },
            { new: true }
        );
    } else {
        return await Source.create({
            userId,
            url,
            count: 1
        });
    }
};

module.exports={
    createSource,
    getAllSource,
    update,
    getTop5
}