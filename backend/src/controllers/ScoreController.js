const vader = require('vader-sentiment')
const { all } = require("../routes/ScoreRouter");
const Score=  require("../schema/ScoreModel")
const Company=  require("../schema/CompanyModel")

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

const getScoreDashboard = async (req, res) => {
  try {
    const { companyId ,time} = req.query; // 👈 comes from /api/scores?promptId=123

    if (!companyId) {
      return res.status(400).json({
        status: "Err",
        message: "companyId is required",
      });
    }
    let formatTime="%b %d"

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
            dailySentiment: { $avg: { $toDouble: "$sentiment" } },
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
const getLastScore = async (req, res) => {
  try {
    const {time} = req.query;
    const companiesResponse = await CompanyService.getAllCompany(req.userId);
    const companies = companiesResponse.data;
    const companyIds = companies.map(c => c._id);

      const lastDay = new Date(Date.now() - time * 24 * 60 * 60 * 1000);

      const dailyAverage = await Score.aggregate([
        {
          $match: {
            createdAt: { $gte: lastDay },
            companyId: { $in: companyIds }

          }
        },
        {
          $group: {
            _id: "$companyId",
            avgVisibility: { $avg: { $toDouble: "$visible" } },
            avgPosition: { $avg: { $toDouble: "$position" } },
            avgSentiment: { $avg: { $toDouble: "$sentiment" } }
          }
        },
          {
            $lookup: {
              from: "companies",        // collection name
              localField: "_id",
              foreignField: "_id",
              as: "company"
            }
          },
          { $unwind: "$company" },
          {
            $project: {
              companyId: "$_id",
              companyName: "$company.name",
              domain: "$company.domain",
              isYour:"$company.isYour",
              avgVisibility: { $concat: [{ $toString: { $round: [{ $multiply: ["$avgVisibility", 100] }, 2] } }, "%"] },
              avgPosition: { $round: ["$avgPosition", 2] },
              avgSentiment: { $round: ["$avgSentiment", 2] },              
              count: 1
            }
          }
      ]);
    return res.status(200).json({
      success: true,
      data: dailyAverage
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
    const promptsResponse = await PromptService.getAllPrompt(req.userId);
    const prompts = promptsResponse.data.filter(prompt => prompt.snapshot);

    if ( !companies.length||!prompts.length) {
      return res.status(200).json({
        status: "OK",
        message: "No companies or prompt found",
        data: { scores: [], analyzed: 0 }
      });
    }
    
    const scores = [];

const models = ["gpt5", "gemini"]; // keys in snapshots

for (const prompt of prompts) {
  for (const model of models) {
    const snapshot = (prompt.snapshots[model] || "").toLowerCase();

    if (!snapshot) continue; // skip if model output missing

    const sentences = snapshot
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(Boolean);

    for (const company of companies) {
      const companyName = company.name.toLowerCase();
      const companySentences = sentences.filter(s => s.includes(companyName));

      let sentiment, position, visible;
      if (companySentences.length > 0) {
        const sentiments = companySentences.map(s =>
          (vader.SentimentIntensityAnalyzer.polarity_scores(s).compound + 1) / 2
        );
        sentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

        const check = snapshot.indexOf(companyName);
        position = (1 - check / snapshot.length) * 10;
        visible = true;
      } else {
        sentiment = 0.5;
        position = 0;
        visible = false;
      }

      scores.push({
        promptId: prompt._id,
        companyId: company._id,
        model,          // track which model this score comes from
        visible,
        position,
        sentiment,
      });
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
    analyzeCompanyScores,
    getScoreDashboard,
    getLastScore

}