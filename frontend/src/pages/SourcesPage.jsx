import React from 'react'
import SortTable from '../components/SortTable';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const fetchSources = async () => {
    try {
        const response = await axios.get(backendUrl+'/source/getall',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    console.log('Full response:', response.data);
    console.log('Companies array:', response.data.data);
    
    // Extract the nested data array
    setSources(response.data.data); // Note the double .data
    console.log(sources);
    } catch (error) {
      console.error('Error:', error);
    } 
    
  };
  useEffect(() => {
  fetchSources();
}, []);

  return (

    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sources</h1>
          <p className="text-gray-600 mt-2">Here's where your data come from.</p>
        </div>
       <SortTable
        data={sources}
        columns={[  { key: 'url', title: 'Domain' },
                    { key: 'count', title: 'Count' }]}
        
        />

      </div>
    </div>  

  );
};


export default SourcesPage