import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SortTable from '../components/SortTable';

const Dashboard = () => {

  const { token } = useAuth();
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [companies, setCompanies] = useState([]);
  const [chart,setChart] = useState([]);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
  const timeRange=[
    {key:"all", value:1000,name:"All time"},
    {key:"today", value:1,name:"Today"},
    {key:"3days", value:3,name:"Last 3 days"},
    {key:"week", value:7,name:"This week"},
    {key:"month", value:30,name:"This month"},
    {key:"year", value:365,name:"This year"},
  ]
    const [time, setTime] = useState(timeRange[0].value); // default selected value

  const fetchCompanies = async () => {
      try {
          const response = await axios.get(backendUrl+'/company/getall',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
          console.log('Companies array:', response.data.data);
          setCompanies(response.data.data); 
      } catch (error) {
        console.error('Error:', error);
      } 
    };
  useEffect(() => {
  fetchCompanies();
}, []);
useEffect(() => {
  if (companies && companies.length > 0) {
    fetchScore();
  }
}, [companies,time]);
    const fetchScore = async () => {
    try {
      let range="&time=1000";
      if(time){
        range='&time='+time;
      }
      console.log(range);
          const promises = companies.map(company => 
        axios.get(backendUrl+'/score/getdashboard?companyId='+company._id+range,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
        );
            const responses = await Promise.all(promises);
    const combinedData = {};
    
    responses.forEach((response, index) => {
      const companyName = companies[index].name;
      response.data.data.forEach(item => {
        const date = item._id;
        if (!combinedData[date]) {
          combinedData[date] = { _id: date };
        }
        combinedData[date][companyName] = [item.dailyAverage,item.dailyPosition];
      });
    });

    // Convert to array format for chart
    const chartData = Object.values(combinedData).sort((a, b) => 
      new Date(a._id) - new Date(b._id)
    );

    setChart(chartData);    
              console.log('chart data:', chartData);
    // Extract the nested data array
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
             <div className="p-4">
      <select
        multiple={false}
        id="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border rounded p-2"
      >
        {timeRange.map((range) => (
          <option key={range.key} value={range.value}>
            {range.name}
          </option>
        ))}
      </select>
    </div> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
  <YAxis
    tick={{ fontSize: 12 }}
    domain={[0, 1]}
    tickFormatter={(value) => {
      const num = Array.isArray(value) ? value[0] : value;
      return `${(num * 100).toFixed(0)}%`;
    }}
  />
                <Tooltip formatter={(value, name) => [`${value*100}%`, name]} />

                {companies.map((company, index) => (
                <Line 
                  key={company._id}
                  type="monotone" 
                dataKey={(d) =>
                  Array.isArray(d[company.name]) ? d[company.name][0] : d[company.name]
                }                  
                name={company.name}
                stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                />
              ))}

              </LineChart>
            </ResponsiveContainer>
            
          </div>
          <div>          <SortTable
          data={companies}
          columns={[  { key: 'name', title: 'School name' },
                      { key: 'value', title: 'Value' }]}
          
          /></div>
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Trend</h3>
           <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, 10.0]}
              tickFormatter={(value) => {
                const num = Array.isArray(value) ? value[1] : value;
                return `${(num)}`;
              }}
            />
                <Tooltip formatter={(value, name) => [`${value.toFixed(1)}`, name]} />

                {companies.map((company, index) => (
                <Line 
                  key={company._id}
                  type="monotone" 
                dataKey={(d) =>
                  Array.isArray(d[company.name]) ? d[company.name][1] : d[company.name]
                }                  
                name={company.name}
                stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                />
              ))}

              </LineChart>
            </ResponsiveContainer>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;