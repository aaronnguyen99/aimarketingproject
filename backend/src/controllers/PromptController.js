require('dotenv').config();
const PromptService=require('../services/PromptService.js')
const SourceService=require('../services/SourceService.js')
const OpenAI = require("openai");
const { GoogleGenAI } = require("@google/genai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const createPrompt=async(req,res)=>{
    try{
        const {content}=req.body        

        if(!content)
        {
            return res.status(200).json({
                status:'Err',
                message:'The input is required'
            })
        }
        const response=await PromptService.createPrompt(req.body,req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

const updatePrompt=async(req,res)=>{
    try{
        const promptId=req.params.id
        const data=req.body
        if(!promptId)
        {
            return res.status(200).json({
                status:'ERR',
                message:'promptId is required'
            })
        }
        const response=await PromptService.updatePrompt(promptId,data)

        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deletePrompt=async(req,res)=>{
    try{
        const promptId=req.params.id
        if(!promptId)
        {
            return res.status(200).json({
                status:'ERR',
                message:'promptId is required'
            })
        }
        const response=await PromptService.deletePrompt(promptId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllPrompt=async(req,res)=>{
    try{
        const response=await PromptService.getAllPrompt(req.userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getPromptLength=async(req,res)=>{
    try{
        const response=await PromptService.getAllPrompt(req.userId)

const totalCount = response.data.reduce((sum, item) => sum + (item.count || 0), 0);

return res.status(200).json({ count: totalCount });
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
function extractBrackets(text) {
  return (text.match(/\[([^\]]*)\]/g) || []).map(match => match.slice(1, -1));
}
const analyzeprompt = async (req, res) => {
  try {
    const response = await PromptService.getAllPrompt(req.userId);
    const prompts = response.data;

    // Process all prompts concurrently for maximum speed
    const processPrompt = async (item) => {
      try {
            const gpt5Response = await openai.responses.create({
                    model: "gpt-5-mini",
            tools: [{
                type: "web_search",
                user_location: {
                    type: "approximate",
                    country: item.geo || "CA" // Default to Canada if geo not provided
                }
            }],
          input: [
            {
              role: "system",
              content: "Always answer directly; no clarifying questions."
            },
            {
              role: "user",
              content: item.content
            }
          ]        
          });
        const gptOutput = gpt5Response.output_text || "No output";
        // const geminiOutput = geminiResponse.text || "No output";

        const source=extractBrackets(gptOutput);

            for(const url of source){
                await SourceService.update(req.userId,url);
            }

        // Update prompt in database
        item.count++
        const updated = await PromptService.updatePrompt(
          item._id,
          {      snapshots: {
        gpt5: gptOutput
        // gemini: geminiOutput,
      }, content: item.content,count:item.count,geo:item.geo }
        );
        return updated;

      } catch (err) {
        console.error("Error analyzing prompt:", err);
        return null; // Return null for failed items
      }
    };

    // Process all prompts simultaneously
    const results = await Promise.all(
      prompts.map(processPrompt)
    );

    // Filter out failed requests (null values)
    const updatedPrompts = results.filter(item => item !== null);

    return res.status(200).json({
      status: "OK",
      message: "Analysis complete",
      data: updatedPrompts,
    });

  } catch (e) {
    return res.status(500).json({
      status: "Error",
      message: e.message,
    });
  }
};
module.exports={
    createPrompt,
    updatePrompt,
    deletePrompt,
    getAllPrompt,
    analyzeprompt,
    getPromptLength
}