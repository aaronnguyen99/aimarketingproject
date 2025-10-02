import React from 'react'
  import axios from 'axios';
import { useEffect,useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Table from '../components/Table';
import AddCompanyModal from '../components/AddCompanyModal';
import api from '../services/api';
import LoadingPage from './LoadingPage';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const addCompany = async (newCompany,domain,isYour) => {
      try {
        
        const response = await api.post("/company/create",
          { 
            "name": newCompany,
            "domain": domain,
            isYour
          });
      } catch (error) {
        console.error("Error:", error);
      }
      
      fetchCompanies();
    };
  const fetchCompanies = async () => {
    try {
        const response = await api.get('/company/getall');
    
    // Extract the nested data array
    setCompanies(response.data.data); // Note the double .data
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
  fetchCompanies();
}, []);

  return (
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-600 mt-2">Add schools you want to keep track</p>
        </div>


    <div>
        <div className="flex self-end  mb-4 border-b border-gray-300">
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
          >
            + Add
        </button>
      </div>
              <AddCompanyModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={addCompany}
            />
        <div className='p-5'>   
        <Table 
        data={companies} 
        setData={setCompanies}
        fetchData={fetchCompanies}
        type="company"
        isPrompt={false}
        loading={loading}
        /></div> 
    </div>      
    </div>
    </div>  
  )
}

export default CompanyPage