const PromptService=require('../services/PromptService.js')
const SourceService=require('../services/SourceService.js')
const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: "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",
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
        console.log('response',response)
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
        console.log('response',response)

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
                    // Call OpenAI with correct API structure
            const completion = await client.responses.create({
                    model: "gpt-5",
          tools: [
            {
              type: "web_search", 
            }
          ],
          input:item.content,
        });

        const output = completion.output_text || "No output";
        const source=extractBrackets(output);

            for(const url of source){
                await SourceService.update(req.userId,url);
            }

        // Update prompt in database
        const updated = await PromptService.updatePrompt(
          item._id,
          { snapshot: output, content: item.content }
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
    analyzeprompt
}