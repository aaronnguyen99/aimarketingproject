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
const getAllSource = (userId,page,limit) => {
    return new Promise(async(resolve,reject) => {
        try{
            const skip = (page - 1) * limit;
            const allSource=await Source.find({userId:userId})
                .sort({ count: -1})
                .skip(skip)
                .limit(limit)
            const total=await Source.countDocuments({ userId: userId })
                resolve({
                    status:'OK',
                    message:"Get All Source Success",
                    totalPages: Math.ceil(total / limit),
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
const update = async (userId, url, recentArticle) => {
  const existing = await Source.findOne({ url });

  if (existing) {
    return await Source.findByIdAndUpdate(
      existing._id,
      { 
        $inc: { count: 1 },
        $set: { recentArticle, updatedAt: new Date() }
      },
      { new: true } 
    );
  } else {
    return await Source.create({
      userId,
      url,
      recentArticle,
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