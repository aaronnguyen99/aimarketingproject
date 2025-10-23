import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell,Radar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SortTable from '../components/SortTable';
import api from '../services/api';
import LoadingPage from './LoadingPage';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [chart,setChart] = useState([]);
  const [dataTable,setDataTable] = useState([]);
  const [sources,setSources]=useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", email: "", phone: "" ,organization:"",address:"",tier:""});
  const [description,setDescription]=useState("")
  const [analysis,setAnalysis]= useState([]);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#b6379aff', '#b66363ff', '#361529ff', '#f70098ff', '#5a0e0eff', '#00ff15ff', '#8c00e9ff', '#8b5cf6'];
  const timeRange=[
    {key:"week", value:7,name:"Last week"},
    {key:"2week", value:14,name:"Last 2 weeks"},
    {key:"month", value:30,name:"Last month"},
    {key:"year", value:365,name:"Last year"},
    {key:"all", value:1000,name:"All time"},

  ]
    const [time, setTime] = useState(timeRange[0].value); // default selected value

   const setHeader = async () => {
      try {
      let time="";
      const now = new Date();
      const hour = now.getHours();
      if(hour<=4||hour>=19){
        time="evening";
      }else if(hour>4&&hour<12){
        time="morning";
      }else{
        time="afternoon";
      }
      let first =""
      if(user.name){
        const firstName=user.name.split(" ")[0];
        first=", "+firstName[0].toUpperCase()+firstName.slice(1).toLowerCase();}
      const des="Good "+time+ first+"! Here's how " +user.organization+ " is showing up in AI Search"
      setDescription(des)
      } catch (error) {
        console.error('Error:', error);
      } 
    };
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/info');
        setUser(response.data.user);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
      const fetchAnalysis = async () => {
      try {
        const response = await api.get('/score/getlastanalyze');
        setAnalysis(response.data.data.analysis);
        console.log("testing chart",response.data.data.analysis);
      } catch (err) {
        setError("Failed to load user data");
      }
    };
  const fetchTable = async () => {
      try {
      let range="?time=1000";
      if(time){
        range='?time='+time;
      }
          const response = await api.get('/score/getlast'+range);
      setDataTable(response.data.data); 
      } catch (error) {
        console.error('Error:', error);
      } 
    };
  const fetchSources = async () => {
    try {
        const response = await api.get('/source/gettop');
      setSources(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } 
    
  };
  const fetchCompanies = async () => {
      try {
          const response = await api.get('/company/getall');
          setCompanies(response.data.data); 
      } catch (error) {
        console.error('Error:', error);
      } 
    };
  useEffect(() => {
  fetchUser();
  fetchCompanies();
  fetchSources();
  fetchAnalysis();
}, []);
useEffect(() => {
  if (companies && companies.length > 0) {
    fetchScore();
      fetchTable();
  }
}, [companies,time]);
useEffect(() => {
  setHeader();
}, [user]);
    const fetchScore = async () => {
    try {
      let range="&time=1000";
      if(time){
        range='&time='+time;
      }
      console.log(range);
          const promises = companies.map(company => 
        api.get('/score/getdashboard?companyId='+company._id+range)
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
        combinedData[date][companyName] = [item.dailyAverage,item.dailyPosition,item.dailySentiment];
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
    }finally {
      setLoading(false); 
    }
  };
const downloadCSV = (data, filename = "scores.csv") => {
  if (!data || data.length === 0) return;

  // 1. Collect all unique universities
  const allUniversities = new Set();
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key !== "_id") allUniversities.add(key);
    });
  });

  const universities = Array.from(allUniversities);

  // 2. Create headers
  const headers = ["Date"];
  universities.forEach(u => {
    headers.push(`${u} Visibility`);
    headers.push(`${u} Position`);
    headers.push(`${u} Sentiment`);
  });

  // 3. Generate rows
  const rows = data.map(row => {
    const rowData = [row._id];
    universities.forEach(u => {
      const scores = row[u] || [];
      for (let i = 0; i < 3; i++) {
        rowData.push(scores[i] != null ? (scores[i]).toFixed(2) : "");
      }
    });
    return rowData.join(",");
  });

  // 4. Combine and download
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">{description}</p>
             <div className="p-4 flex justify-between w-full border-b border-gray-300">
              <div className="gap-6 mb-8">
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
            <div >
                <div><button
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center gap-2"
                  onClick={() => downloadCSV(chart)}
                >
                  <span className="border-gray-300 text-gray-700 ">📄</span>
                  Export CSV
                </button></div>     
            </div> 

        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className='flex justify-between mb-6'>
            <h3 className="text-lg font-semibold text-gray-900">Visibility Trend</h3>
            <div className="relative group inline-block">
              <button className="">
                <span class="text-blue-600 text-2xl">ⓘ</span>
            </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                rounded-md bg-gray-800 text-white text-sm px-2 py-1 whitespace-nowrap">
                % of chats where tracked schools and organizations are mentioned
              </span>
            </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 1]}
                  tickFormatter={(value) => {
                    const num = Array.isArray(value) ? value[0] : value;
                    return `${(num * 100).toFixed(1)}%`;
                  }}
                />
                <Tooltip formatter={(value, name) => [`${(value*100).toFixed(1)}%`, name]} />

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
            )}
          </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
            <SortTable
                data={dataTable}
                columns={[  
                            { key: 'avgVisibility', title: 'Visibility' }
                            ]}
                defaultSort={{ key: 'avgVisibility', title: 'Visibility' }}
                />
            </div>
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className='flex justify-between mb-6'>
            <h3 className="text-lg font-semibold text-gray-900">Position Trend</h3>
            <div className="relative group inline-block">
              <button className="">
                <span class="text-blue-600 text-2xl">ⓘ</span>
            </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                rounded-md bg-gray-800 text-white text-sm px-2 py-1 whitespace-nowrap">
              Average ranking of your school in AI responses              </span>
            </div>
            </div>
              {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
              </div>
            ) : (
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
            )}
          </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className='flex justify-between mb-6'>
            <h3 className="text-lg font-semibold text-gray-900">Sentiment Trend</h3>
            <div className="relative group inline-block">
              <button className="">
                <span class="text-blue-600 text-2xl">ⓘ</span>
            </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                rounded-md bg-gray-800 text-white text-sm px-2 py-1 whitespace-nowrap">
            VADER sentiment analysis of the schools mentioned in AI responses              </span>
            </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-b-4 border-gray-300"></div>
              </div>
            ) : (
          //  <ResponsiveContainer width="100%" height={250}>
          //     <LineChart data={chart}>
          //       <CartesianGrid strokeDasharray="3 3" />
          //       <XAxis dataKey="_id" />
          //   <YAxis
          //     tick={{ fontSize: 12 }}
          //     domain={[0, 1.0]}
          //     tickFormatter={(value) => {
          //       const num = Array.isArray(value) ? value[2] : value;
          //       return `${(num * 100).toFixed(1)}%`;
          //     }}
          //   />
          //       <Tooltip formatter={(value, name) => [`${(value * 100).toFixed(1)}%`, name]} />

          //       {companies.map((company, index) => (
          //       <Line 
          //         key={company._id}
          //         type="monotone" 
          //       dataKey={(d) =>
          //         Array.isArray(d[company.name]) ? d[company.name][2] : d[company.name]
          //       }                  
          //       name={company.name}
          //       stroke={colors[index % colors.length]}
          //         strokeWidth={2}
          //         dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
          //       />
          //     ))}

          //     </LineChart>
          //   </ResponsiveContainer>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={analysis.radarData}>
                  <PolarGrid stroke="#0e2446ff" />
                  <PolarAngleAxis 
                    dataKey="topic" 
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name="Sentiment Score"
                    dataKey="score"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">    
              <div className='flex justify-between mb-6'>
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Sources</h3>
            <div className="relative group inline-block">
              <button className="">
                <span class="text-blue-600 text-2xl">ⓘ</span>
            </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                rounded-md bg-gray-800 text-white text-sm px-2 py-1 whitespace-nowrap">
            Most sources used across AI models              </span>
            </div>
            </div>        
            <SortTable
              data={sources}
              columns={[  { key: 'url', title: 'Domain' },
                          { key: 'count', title: 'Total Use' }]}
              defaultSort={{ key: 'count', title: 'Total Use' }}
              />
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;