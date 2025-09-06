const Score=  require("../schema/ScoreModel")

const createScore=async(req,res)=>{
    try{
        const {companyId,promptId,visible}=req.body        

        if(visible===null||!companyId||!promptId)
        {
            return res.status(400).json({
                status:'Err',
                message:'The input is required error'
            })
        }
            const score = new Score({ companyId, promptId, visible });
            await score.save();
            res.json({data: score });

        return res.status(200).json(res)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllScorePrompt = async (req, res) => {
  try {
    const { promptId } = req.query; // 👈 comes from /api/scores?promptId=123

    if (!promptId) {
      return res.status(400).json({
        status: "Err",
        message: "promptId is required",
      });
    }

    const allScore = await Score.find({ promptId });

    return res.status(200).json({
      status: "OK",
      message: "Get All Score Success",
      data: allScore,
    });
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      message: e.message || "Server error",
    });
  }
};
module.exports={
    createScore,
    getAllScorePrompt

}