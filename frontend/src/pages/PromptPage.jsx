import { useState } from 'react'
import Table from './../components/Table';
import AddPromptModal from './../components/AddPromptModal';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function PromptPage() {
  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);

const [company,setCompany]=useState("");
const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(backendUrl+'/prompt/getall',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    setData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
  fetchData();
}, []);

const fetchResponse = async () => {
  try {
    setLoading(true);
    const response = await axios.post(
      backendUrl + '/prompt/analyze',
      {}, // Empty data object since you're not sending any body data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Handle the response
    console.log('Analysis complete:', response);
    // You might want to update some state with the response
    // setAnalysisResult(response.data);
      fetchData();

  } catch (err) {
    console.error("Error fetching response:", err);
    // Handle error (show toast, set error state, etc.)
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
    const addData = async (promptText) => {
      try {
        const response = await axios.post(
          backendUrl+"/prompt/create",
          { 
            content: promptText 
          },
          { 
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
      
      fetchData();
    };

    const updateVisibility = (index, newVisibility) => {
      setData((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, visibility: newVisibility } : row
        )
      );
    };
  return (
    <div className="p-2">
      <header className="bg-white min-h-screen flex flex-col items-center text-black text-lg">
        <div className="flex self-end">
        <button
        onClick={() => setIsModalOpen(true)}
        className="max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
      >
        + Add
      </button></div>

        <Table 
        data={data} 
        setData={setData}
        fetchData={fetchData}
        type="prompt"
        isPrompt={true}
        />

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
          onClick={() => fetchResponse()}

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
