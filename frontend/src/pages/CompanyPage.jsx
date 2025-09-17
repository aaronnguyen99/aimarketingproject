import React from 'react'
  import axios from 'axios';
import { useEffect,useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Table from '../components/Table';
import AddCompanyModal from '../components/AddCompanyModal';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const addCompany = async (newCompany,domain) => {
      try {
        
        const response = await axios.post(
          backendUrl+"/company/create",
          { 
            "name": newCompany,
            "domain": domain
          },
          { 
            headers: {
              Authorization: `Bearer ${token}`, // 👈 headers
            },
          }
        );
        console.log(newCompany);
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
      
      fetchCompanies();
    };
  const fetchCompanies = async () => {
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
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
  fetchCompanies();
}, []);

 if (loading) return <div>Loading...</div>;

  return (
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-600 mt-2">Add schools and organizations you want to keep track.</p>
        </div>


    <div>
        <div className="flex self-end  mb-4 border-b border-gray-300">
          <button
            onClick={() => setIsModalOpen(true)}
            className="max-w-md mb-4 px-4 py-2 bg-black text-white rounded-lg "
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
        /></div> 
    </div>      
    </div>
    </div>  
  )
}

export default CompanyPage