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
  if (!companies.length) return <div>No companies found</div>;

  return (
    <div>
        <div className="flex self-end">
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
        <Table 
        data={companies} 
        setData={setCompanies}
        fetchData={fetchCompanies}
        type="company"
        isPrompt={false}
        />
    </div>
  )
}

export default CompanyPage