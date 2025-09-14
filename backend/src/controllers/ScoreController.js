const { all } = require("../routes/ScoreRouter");
const Score=  require("../schema/ScoreModel")
const PromptService=require('../services/PromptService.js')
const CompanyService=require('../services/CompanyService.js')
const { default: mongoose } = require("mongoose");

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

const getAverageScore = async (req, res) => {
  try {
    const { promptId,companyId ,startDate, endDate} = req.query; // 👈 comes from /api/scores?promptId=123

    if (!promptId&&!companyId) {
      return res.status(400).json({
        status: "Err",
        message: "Either promptId or companyId is required",
      });
    }
        const filter = { };
        if (startDate && endDate) {
        // Custom date range
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
        }
        if (promptId) filter.promptId = promptId;
        if (companyId) filter.companyId = companyId;
        const allScore = await Score.find(filter);
        if(allScore.length===0){
            return res.status(200).json({
            status: "OK",
            message: "Empty",
            data:[0,0]
    });
        }
        filter.visible=true;
        const allvisible=await Score.find(filter);
        let position=0;
        for(const property of allvisible){
            position+=property.position;
        }

    const percent=allvisible.length*100/allScore.length;

        position/=allScore.length;
    return res.status(200).json({
      status: "OK",
      message: "Get All Score Success",
      data: [Math.floor(percent),position.toFixed(1)]
    });
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      message: e.message || "Server error",
    });
  }
};
const getScoreDashboard = async (req, res) => {
  try {
    const { companyId ,time} = req.query; // 👈 comes from /api/scores?promptId=123

    if (!companyId) {
      return res.status(400).json({
        status: "Err",
        message: "companyId is required",
      });
    }
    let formatTime="%Y-%m-%d"

        const sevenDaysAgo = new Date(Date.now() - time * 24 * 60 * 60 * 1000);
    const dailyAverages = await Score.aggregate([
      {
        $match: {
        $or: [
            { companyId: companyId },
            { companyId: new mongoose.Types.ObjectId(companyId) }
        ],
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: formatTime,
              date: "$createdAt"
            }
          },
            dailyAverage: { $avg: { $toDouble: "$visible" } },
            dailyPosition: { $avg: { $toDouble: "$position" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    return res.status(200).json({
      success: true,
      data: dailyAverages
    });
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      message: e.message || "Server error",
    });
  }
};

const analyzeCompanyScores = async (req, res) => {
  try {

    // Get all companies
    const companiesResponse = await CompanyService.getAllCompany(req.userId);
    const companies = companiesResponse.data;

    if ( !companies.length) {
      return res.status(200).json({
        status: "OK",
        message: "No companies found",
        data: { scores: [], analyzed: 0 }
      });
    }

    const scores = [];

    // Analyze each snapshot against each company
    for (const company of companies) {
      // Convert to lowercase for better matching
          const promptsResponse = await PromptService.getAllPromptCompany(company);
            const prompts = promptsResponse.data.filter(prompt => prompt.snapshot);
      for (const prompt of prompts) {
         const snapshot = prompt.snapshot.toLowerCase();
        const companyName = company.name.toLowerCase();
        const check=snapshot.indexOf(companyName);

        // Check if company name exists in snapshot
        if (check!==-1) {
            const position = (1 - parseFloat(check) / snapshot.length) * 10;
            scores.push({
                "promptId":prompt._id,
                "companyId":company._id,
                "visible":true,
                "position":position
            })
        }
        else{
            scores.push({
            "promptId":prompt._id,
            "companyId":company._id,
            "visible":false,
            "position":0
          })
        }
      }
    }

    // Bulk create scores in database
    if (scores.length > 0) {
      const createdScores = await Score.insertMany(scores);
      
      return res.status(200).json({
        status: "OK",
        message: `Analysis complete. ${scores.length} scores created.`,
        data: {
          scores: createdScores,
          analyzed: scores.length,
          companies: companies.length
        }
      });
    } else {
      return res.status(200).json({
        status: "OK",
        message: "No company mentions found in snapshots",
        data: { scores: [], analyzed: 0 }
      });
    }

 
  } catch (error) {
    console.error('Error analyzing company scores:', error);
    return res.status(500).json({
      status: "Error",
      message: error.message
    });
  }
};
module.exports={
    createScore,
    getAverageScore,
    analyzeCompanyScores,
    getScoreDashboard

}