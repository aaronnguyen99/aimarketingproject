const vader = require('vader-sentiment')
const { pipeline } = require('@xenova/transformers');
const { all } = require("../routes/ScoreRouter");
const Score=  require("../schema/ScoreModel")
const Company=  require("../schema/CompanyModel")

const PromptService=require('../services/PromptService.js')
const CompanyService=require('../services/CompanyService.js')
const { default: mongoose } = require("mongoose");


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
            dailyAverage: { $avg: { $toDouble: "$visibleScore" } },
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
            avgVisibility: { $avg: { $toDouble: "$visibleScore" } },
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
    const prompts = promptsResponse.data.filter(prompt => prompt.snapshots);

    if ( !companies.length||!prompts.length) {
      return res.status(200).json({
        status: "OK",
        message: "No companies or prompt found",
        data: { scores: [], analyzed: 0 }
      });
    }
    
    const scores = [];

const models = ["gpt5"]; 
const sentimentPipeline = await pipeline('sentiment-analysis');
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

      let sentiment, position, visible,visibleScore;
      if (companySentences.length > 0) {
        //VISIBILITY SCORE
        const baseScore = 0.3; 
        const freqScore = Math.min(companySentences.length , 5)/5 * 0.3;
        const depth = companySentences.reduce((total, s) => total + s.length, 0);
        const depthScore = (depth / snapshot.length) * 0.4; 
        visibleScore = baseScore + freqScore + depthScore;
        //POSITION SCORE
        const indices = [];
        const numParts = 10;
        const partSize = snapshot.length / numParts;

        let index = snapshot.indexOf(companyName);

        while (index !== -1) {
          indices.push(index);
          index = snapshot.indexOf(companyName, index + companyName.length);
        }
        const avg= indices.reduce((a, b) => a + b, 0) / indices.length;
        const weightedRatio=(indices[0]*0.7+avg*0.3)/ snapshot.length;
        const placeScore=9.0*(1-weightedRatio);
        const partsWithCompany = new Set(
          indices.map(i => Math.floor(i / partSize))
        );
        const distScore = (partsWithCompany.size / 9) * 0.11;
        position = placeScore*(1+distScore);
        //SENTIMENT SCORE
        const sentiments = [];
        for (const s of companySentences) {
          const result = await sentimentPipeline(s);
          const { label, score } = result[0];
          const signed = label === 'NEGATIVE' ? -score : score;
          sentiments.push(signed);
        }

        // Average sentiment (-1 to +1)
        sentiment =sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
        sentiment = (sentiment + 1) / 2; // normalize to 0-1


      } else {
        sentiment = 0.35;
        position = 0;
        visibleScore=0;
      }

      scores.push({
        promptId: prompt._id,
        companyId: company._id,
        model,          // track which model this score comes from
        position,
        sentiment,
        visibleScore
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
    analyzeCompanyScores,
    getScoreDashboard,
    getLastScore

}