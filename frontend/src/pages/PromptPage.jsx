import { useState } from 'react'
import Table from './../components/Table';
import AddPromptModal from './../components/AddPromptModal';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import DropdownMenu from '../components/DropdownMenu';

function PromptPage() {
  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);

const [company,setCompany]=useState([]);
  const [companies, setCompanies] = useState([]);

const [data, setData] = useState([]);
const [score, setScore] = useState([]);
  const fetchScore = async (companyId) => {
    try {
    //   const response = await axios.get(backendUrl+'/score/getaverage?promptId='+promptId+'&&companyId='+companyId,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    // setScore(response.data.data[0]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateScoreAll = async () => {
    try {
        const response = await axios.post(backendUrl+'/score/analyze',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
    // Extract the nested data array    
    } catch (error) {
      console.error('Error:', error);
    }
    
  };  const fetchCompanies = async () => {
    try {
        const response = await axios.get(backendUrl+'/company/getall',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    console.log('Full response:', response.data);
    console.log('Companies array:', response.data.data);
    
    // Extract the nested data array
    setCompanies(response.data.data); // Note the double .data
    
    } catch (error) {
      console.error('Error:', error);
    }
    
  };
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
  fetchCompanies();

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
      generateScoreAll();
  } catch (err) {
    console.error("Error fetching response:", err);
    // Handle error (show toast, set error state, etc.)
  } finally {
    setLoading(false);
  }
};
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


  return (
    <div className="p-2">
      <header className="bg-white min-h-screen flex flex-col items-center text-black text-lg">
        
        <div className="flex justify-between items-center w-full mb-4">
        <div>
          <DropdownMenu
          data={companies}
          setData={setCompany}
          />
        </div>
        <div>
        <button
        onClick={() => setIsModalOpen(true)}
        className="max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
      >
        + Add
      </button></div></div>
      <div>
        <Table 
        data={data} 
        setData={setData}
        fetchData={fetchData}
        type="prompt"
        isPrompt={true}
        fetchScore={fetchScore}
        />
      </div>
        <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addData}
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
