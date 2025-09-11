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
    <div>
      <SortTable
      data={sources}
      columns={[  { key: 'url', title: 'Domain' },
                  { key: 'count', title: 'Count' }]}
      
      />
    </div>
  );
};


export default SourcesPage