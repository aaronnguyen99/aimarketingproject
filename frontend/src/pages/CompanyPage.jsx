import React from 'react'
  import axios from 'axios';
import { useEffect,useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
useEffect(() => {
  const fetchCompanies = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/company/getall',
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

  fetchCompanies();
}, []);

 if (loading) return <div>Loading...</div>;
  if (!companies.length) return <div>No companies found</div>;

  return (
    <div>
      <h2>Companies ({companies.length})</h2>
      {companies.map(company => (
        <div key={company._id || company.id}>
          {company.name || JSON.stringify(company)}
        </div>
      ))}
    </div>
  )
}

export default CompanyPage