import { useState } from 'react'
import Table from './../components/Table';
import AddPromptModal from './../components/AddPromptModal';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingPage from './LoadingPage';

function PromptPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [load,setLoad]=useState(true);
  const [notification, setNotification] = useState("");
  const [data, setData] = useState([]);
  const generateScoreAll = async () => {
    try {
        const response = await api.post('/score/analyze',{});
            setNotification("Prompt analyzed successfully!");

    // Extract the nested data array    
    } catch (error) {
      console.error('Error:', error);
    }finally{
          setLoading(false);

    }
          setTimeout(() => setNotification(""), 5000);

  };  
  const fetchData = async () => {
    try {
      const response = await api.get('/prompt/getall');
    setData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }finally{
      setLoad(false);
    }
  };
  useEffect(() => {
    fetchData();
  
}, []);
const fetchResponse = async () => {
  try {
    setLoading(true);
    const response = await api.post('/prompt/analyze',{});
      fetchData();
      generateScoreAll();
  } catch (err) {
    console.error("Error fetching response:", err);
    // Handle error (show toast, set error state, etc.)
              if (err.response) {
    // Server responded with a status code outside 2xx
          setNotification(err.response.data.error);
        } else {
          setNotification("Network error");
        }
  } 
    setTimeout(() => setNotification(""), 5000);
};
    // 🔑 function to add data
    const addData = async (promptText,country) => {
      try {
        const response = await api.post("/prompt/create",
          { 
            content: promptText,
            geo: country 
          }
        );
        setNotification("Prompt created successfully!");
      } catch (error) {
        console.error("Error:", error);
          if (error.response) {
    // Server responded with a status code outside 2xx
          setNotification(error.response.data.error);
        } else {
          setNotification("Network error");
        }
      }
      setTimeout(() => setNotification(""), 5000);
      fetchData();
    };
  return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Prompts</h1>
              <p className="text-gray-600 mt-2">Add prompts to be analyzed daily</p>
            </div>

        
        <div className="flex justify-between items-center w-full mb-4 border-b border-gray-300">
        <div>
        <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
      >
        + Add
      </button></div>
      {notification && (
        <div className="p-2 bg-green-100 text-green-700 border border-green-400 rounded mb-2">
          {notification}
        </div>
      )}
      <div >              <p className="text-gray-600 mt-2">{data.length} of 25 prompts used</p></div>
      
      </div>
      <div className=' mt-8 p-5'>
        <Table 
        data={data} 
        setData={setData}
        fetchData={fetchData}
        type="prompt"
        isPrompt={true}
        loading={load}
        />
      </div>
        <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addData}
      />
        {/* <button
          onClick={() => fetchResponse()}

          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition max-w-md
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-neutral-900 hover:bg-black"}
            text-white shadow`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button> */}
    </div>
        </div>  
  );
}

export default PromptPage
