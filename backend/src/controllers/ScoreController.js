const vader = require('vader-sentiment')
const { pipeline } = require('@xenova/transformers');
const { all } = require("../routes/ScoreRouter");
const Score=  require("../schema/ScoreModel")
const Company=  require("../schema/CompanyModel")
const { GoogleGenAI } = require("@google/genai");
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const PromptService=require('../services/PromptService.js')
const CompanyService=require('../services/CompanyService.js')
const { default: mongoose } = require("mongoose");

  const TOPICS = [
  { id: 'career', name: 'Career Outcomes & Job Placement', color: '#3b82f6' },
  { id: 'reputation', name: 'Academic Reputation & Rankings', color: '#8b5cf6' },
  { id: 'curriculum', name: 'Program Curriculum & Specializations', color: '#ec4899' },
  { id: 'alumni', name: 'Alumni Network', color: '#f59e0b' },
  { id: 'location', name: 'Campus Location', color: '#10b981' },
  { id: 'tuition', name: 'Tuition & Financial Aid', color: '#06b6d4' },
  { id: 'campus_life', name: 'Campus Life', color: '#6366f1' },
  { id: 'resources', name: 'Resources & Experiential Learning', color: '#14b8a6' }
];

const TRAIT_RULES = [
  { name: 'Prestigious/Premium', conditions: { reputation: 80 } },
  { name: 'Career-Focused', conditions: { career: 80 } },
  { name: 'Budget-Friendly', conditions: { tuition: 80 } },
  { name: 'Hands-On/Practical', conditions: { resources: 80 } },
  { name: 'Well-Connected', conditions: { alumni: 80 } },
  { name: 'Strategically Located', conditions: { location: 80 } },
  { name: 'Specialized Programs', conditions: { curriculum: 80 } },
  { name: 'Vibrant Campus', conditions: { campus_life: 80 } }
];
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
const analyzeText = async (req,res) => {
      const companiesResponse = await CompanyService.getYourCompany(req.userId);
    const companies = companiesResponse.data;
    const promptsResponse = await PromptService.getAllPrompt(req.userId);
const models = ["gpt5"];

const snapshots = promptsResponse.data
  .filter(prompt => prompt.snapshots?.[models[0]])
  .map(prompt => prompt.snapshots[models[0]]);
    const inputText=snapshots.join(", ");
    const schoolName=companies[0].name;

    if (!inputText.trim() || !schoolName.trim()) {
      return;
    }

    try {
      const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a sentiment analysis system for school brand perception. Analyze the following text about "${schoolName}" and provide a structured JSON response.

TEXT TO ANALYZE:
${inputText}

ANALYSIS REQUIREMENTS:
1. Identify all mentions of "${schoolName}" including variations (e.g., "${schoolName.split(' ')[0]}", short forms, etc.)
2. For each of these 8 topical areas, determine:
   - Whether the text discusses this topic (true/false)
   - Sentiment score (0-100) where:
     * 0-40: Negative sentiment (weaknesses, concerns, disadvantages)
     * 41-60: Neutral/Mixed sentiment
     * 61-100: Positive sentiment (strengths, advantages, praise)
   - Key evidence: 1-2 sentence summary of what was said

TOPICS:
1. career: Career Outcomes & Job Placement (employment rates, salaries, career services)
2. reputation: Academic Reputation & Rankings (prestige, accreditations, rankings)
3. curriculum: Program Curriculum & Specializations (program variety, teaching approaches)
4. alumni: Alumni Network (size, engagement, geographic spread)
5. location: Campus Location (access to jobs, markets, weather, cost of living)
6. tuition: Tuition & Financial Aid (affordability, scholarships, ROI)
7. campus_life: Campus Life (class size, competition vs collaboration, diversity, activities)
8. resources: Resources & Experiential Learning (co-ops, internships, exchanges, competitions)

SCORING GUIDELINES:
- If a topic is discussed positively (strengths, advantages), score 70-100
- If discussed with trade-offs or mixed points, score 50-70
- If discussed negatively (weaknesses, concerns), score 20-50
- If mentioned but neutral factual info only, score 45-55
- If not discussed at all, mark discussed: false and score: null

IMPORTANT: 
- Be consistent: "More affordable" or "lower costs" for location/tuition should score high (80+)
- "More expensive" or "higher costs" should score lower (30-50)
- Comparisons matter: if school is presented as better in something, score higher

Respond ONLY with valid JSON in this exact format:
{
  "topics": {
    "career": {
      "discussed": true/false,
      "score": 0-100 or null,
      "evidence": "brief summary or null"
    },
    "reputation": { ... },
    "curriculum": { ... },
    "alumni": { ... },
    "location": { ... },
    "tuition": { ... },
    "campus_life": { ... },
    "resources": { ... }
  },
  "schoolMentions": ["list of variations found"],
  "overallTone": "positive/neutral/negative"
}

DO NOT include any text outside the JSON structure. NO markdown formatting, NO backticks.`        
      });

      let analysisText = response.text;
      
      // Strip any markdown formatting
      analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const analysis = JSON.parse(analysisText);

      // Calculate overall score (average of discussed topics)
      const discussedScores = Object.values(analysis.topics)
        .filter(t => t.discussed && t.score !== null)
        .map(t => t.score);
      
      const overallScore = discussedScores.length > 0
        ? Math.round(discussedScores.reduce((a, b) => a + b, 0) / discussedScores.length)
        : null;

      // Prepare radar chart data
      const radarData = TOPICS.map(topic => ({
        topic: topic.name,
        score: analysis.topics[topic.id].score || 0,
        fullMark: 100
      }));

      // Identify differentiation traits
      const traits = TRAIT_RULES
        .filter(rule => {
          return Object.entries(rule.conditions).every(([topicId, threshold]) => {
            const topicScore = analysis.topics[topicId]?.score;
            return topicScore && topicScore >= threshold;
          });
        })
        .map(rule => rule.name);
      return res.status(200).json({
        status: "OK",
        message: `Analysis complete.`,
        data: {
          analysis,
          overallScore,
          radarData,
          traits,
          schoolName
        }
      });

    } catch (err) {
      console.error('Analysis error:', err);
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
    getLastScore,
    analyzeText

}