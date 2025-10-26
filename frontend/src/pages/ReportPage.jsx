import React from 'react'
import api from '../services/api';
import { useEffect,useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Award } from 'lucide-react';
import LoadingPage from './LoadingPage';
const ReportPage = () => {
    const TOPICS = [
  { id: 'career', name: 'Career Outcomes & Job Placement', color: '#3b82f6' },
  { id: 'reputation', name: 'Academic Reputation & Rankings', color: '#8b5cf6' },
  { id: 'curriculum', name: 'Program Curriculum & Specializations', color: '#ec4899' },
  { id: 'alumni', name: 'Alumni Network', color: '#f59e0b' },
  { id: 'location', name: 'Campus Location', color: '#10b981' },
  { id: 'tuition', name: 'Tuition & Financial Aid', color: '#06b6d4' },
  { id: 'campus_life', name: 'Campus Life', color: '#6366f1' },
  { id: 'resources', name: 'Resources & Experiential Learning', color: '#14b8a6' }
];

    const [analysis,setAnalysis]= useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalysis = async () => {
        try {
            const response = await api.get('/score/getlastanalyze');
            setAnalysis(response.data.data.analysis);
            console.log("testing",response.data.data.analysis);
        } catch (err) {
            setError("Failed to load user data");
        }finally {
            setLoading(false);
        }
        };
      useEffect(() => {
      fetchAnalysis();
    }, []);
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Positive';
    if (score >= 50) return 'Mixed/Neutral';
    return 'Negative';
  };
  if(loading){
    return LoadingPage;
  }
  else
  return (

    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto mb-8 ">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">Get your daily report on {analysis.schoolName}</p>
        </div>
        
        <div className="p-5 border-t border-gray-300">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Comprehensive Analysis</h3>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={analysis.radarData}>
                  <PolarGrid stroke="#d1d5db" />
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
            
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                {TOPICS.map(topic => {
                console.log("looking for", topic.id, "found:", analysis.analysis.topics[topic.id]);
                const topicData = analysis.analysis.topics[topic.id];

                return (
                    <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                        {topicData.discussed ? (
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${getScoreColor(topicData.score)}`}>
                            {topicData.score}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(topicData.score)}`}>
                            {getScoreLabel(topicData.score)}
                            </span>
                        </div>
                        ) : (
                        <span className="text-gray-400 text-sm">Not Discussed</span>
                        )}
                    </div>
                    {topicData.evidence && (
                        <p className="text-sm text-gray-600 mt-2">{topicData.evidence}</p>
                    )}
                    </div>
                );
                })}
              </div>
            </div>
        </div>
    </div>
  );
}

export default ReportPage