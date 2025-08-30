import { useState } from 'react'
import OpenAI from "openai";
import Table from './../components/Table';
import AddPromptModal from './../components/AddPromptModal';

function PromptPage() {
  const [count, setCount] = useState(0)
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
// IMPORTANT
// FIX LEAKING API BEFORE PUSHING
// USE EXPRESS JS
//
const client = new OpenAI({ apiKey:apiKey , dangerouslyAllowBrowser: true  });
//
//
//
//
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);

const [company,setCompany]=useState("");
const [data, setData] = useState([

    ]);
  const fetchResponse = async (newPrompt) => {
    try {
      setLoading(true);
      const res = await client.responses.create({
        model: "gpt-4o",
        input:"Always return output in valid GitHub-flavored Markdown:\n"+ newPrompt,
      });
      const companyCheck = checkCompany(res.output_text); // sync call
      const idx = data.findIndex((row) => row.prompt ===newPrompt);
      if(companyCheck>-1){
        updateVisibility(idx,100+"%");
        updatePosition(idx,Math.round((10*(1-1.0*companyCheck/res.output_text.length))* 10) / 10+"/10")
      }
      else{
        updateVisibility(idx,0+"%");
      }
      updateConversation(idx,res.output_text)
    } catch (err) {
      console.error("Error fetching response:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkCompany=(output)=>{
    if(company.trim().length===0){
      return;
    }
    return output.toLowerCase().indexOf(company.toLowerCase());

  }


    // 🔑 function to add data
    const addData = (promptText) => {
      if (!promptText) return; // avoid adding empty prompts
      const newRow = {
        prompt: promptText,
        visibility: "_",
        position: "_",
        sentiment: "_",
        result:"",
      };

      setData((prev) => [...prev, newRow]);
    };

    const updateVisibility = (index, newVisibility) => {
      setData((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, visibility: newVisibility } : row
        )
      );
    };
    const updatePosition = (index, newPosition) => {
      setData((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, position: newPosition } : row
        )
      );
    };
    const updateConversation = (index, newResult) => {
      setData((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, result: newResult } : row
        )
      );
    };
  return (
    <div className="p-5">
      <header className="bg-white min-h-screen flex flex-col items-center justify-evenly text-black text-[calc(10px+2vmin)] m-0">
        <div className="flex self-end">
        <button
        onClick={() => setIsModalOpen(true)}
        className="max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
      >
        + Add
      </button></div>

        <Table data={data} setData={setData}/>

        <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addData}
      />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter organization name"
          className="max-w-md w-full px-6 py-2 rounded-xl border border-gray-300 
               shadow-sm text-gray-700 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition duration-200"
        />
        <button
          onClick={async () => {
            setOutputs([]);
            for (const item of data) {
              await fetchResponse(item.prompt);
            }
          }}

          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition max-w-md
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-neutral-900 hover:bg-black"}
            text-white shadow`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </header>
    </div>
  );
}

export default PromptPage
