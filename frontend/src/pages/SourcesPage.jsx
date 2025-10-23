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
  const [page,setPage]=useState(1);
    const [totalPages, setTotalPages] = useState(1);
  const limit=20;
   const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const fetchSources = async () => {
    try {
      const response = await api.get('/source/getall', {
        params: { page, limit }
      });
        setSources(response.data.data); 
        console.log("source",response)
        setTotalPages(response.data.totalPages || 1);
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
  useEffect(() => {
    fetchSources();
  }, [page]);
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
              key: 'recentArticle',
              title: 'Last Used',
              render: (value, row) => (
                <a
                  href={row.recentArticle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {row.recentArticle?.length > 50
                    ? row.recentArticle.slice(0, 50) + '…'
                    : row.recentArticle || '—'}
                </a>
              ),
            },            { 
              key: 'count', 
              title: 'Average usage', 
              render: (value, row) => {
                if (!count || count === 0) return 0;
                return ((row.count || 0) /count).toFixed(1) ;
              }
            }
            
          ]}
          loading={loading}
          defaultSort={{ key: 'count', title: 'Count' }}
        />
      </div>
            <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span>
          Page <strong>{page}</strong> of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
      </div>
    </div>  

  );
};


export default SourcesPage