import React from 'react'
import SortTable from '../components/SortTable';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import api from '../services/api';
import LoadingPage from './LoadingPage';

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [count,setCount]=useState(0);
  const [loading, setLoading] = useState(true);


  const fetchSources = async () => {
    try {
        const response = await api.get('/source/getall');
        setSources(response.data.data); 
    } catch (error) {
      console.error('Error:', error);
    } finally {
    setLoading(false);
  }
  };
    const fetchCount = async () => {
    try {
        const response = await api.get('/prompt/getlength');
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
          <p className="text-gray-600 mt-2">Here's where your data come from</p>
        </div>
        <div className='p-5 border-t border-gray-300'>
        <SortTable
          data={sources}
          columns={[
            { key: 'url', title: 'Domain' },
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
          loading={loading}
          defaultSort={{ key: 'count', title: 'Count' }}
        />
      </div>
      </div>
    </div>  

  );
};


export default SourcesPage