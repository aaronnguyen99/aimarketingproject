import React from 'react'
import SortTable from '../components/SortTable';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [count,setCount]=useState(0);
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
        setSources(response.data.data); 
    console.log(sources);
    } catch (error) {
      console.error('Error:', error);
    } 
  };
    const fetchCount = async () => {
    try {
        const response = await axios.get(backendUrl+'/prompt/getlength',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setCount(response.data.count); 
      
    } catch (error) {
      console.error('Error:', error);
    } 
  };
  useEffect(() => {
  fetchSources();
  fetchCount();
}, []);

  return (

    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold text-gray-900">Sources</h1>
          <p className="text-gray-600 mt-2">Here's where your data come from.</p>
        </div>
        <div className='p-5 border-t border-gray-300'>
        <SortTable
          data={sources}
          columns={[
            { key: 'url', title: 'Domain' },
            // { 
            //   key: 'count', 
            //   title: 'Percents used',
            //   render: (value, row) => {
            //     // normalize by total count
            //     const totalCount = sources.reduce((sum, r) => sum + (r.count || 0), 0);
            //     if (!totalCount) return "0%";
            //     return ((row.count || 0) / totalCount * 100).toFixed(2) + "%";
            //   }
            // },
            { 
              key: 'count', 
              title: 'Average usage', 
              render: (value, row) => {
                // Use another field from the row to divide
                if (!count || count === 0) return 0;
                return ((row.count || 0) /count).toFixed(1) ;
              }
            }
            
          ]}
          defaultSort={{ key: 'count', title: 'Count' }}
        />
      </div>
      </div>
    </div>  

  );
};


export default SourcesPage