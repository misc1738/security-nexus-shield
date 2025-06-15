
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Shield } from 'lucide-react';

const ThreatAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [threatTrends, setThreatTrends] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);

  useEffect(() => {
    // Mock data generation based on time range
    generateMockData();
  }, [timeRange]);

  const generateMockData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    const trends = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      threats: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 30) + 40,
      resolved: Math.floor(Math.random() * 20) + 35
    }));

    const severity = [
      { name: 'Critical', value: 8, color: '#ef4444' },
      { name: 'High', value: 24, color: '#f97316' },
      { name: 'Medium', value: 45, color: '#eab308' },
      { name: 'Low', value: 23, color: '#22c55e' }
    ];

    const types = [
      { type: 'Malware', count: 45, trend: '+12%' },
      { type: 'Phishing', count: 32, trend: '-5%' },
      { type: 'Suspicious Network', count: 28, trend: '+8%' },
      { type: 'Policy Violation', count: 19, trend: '+3%' },
      { type: 'Unauthorized Access', count: 12, trend: '-2%' }
    ];

    setThreatTrends(trends);
    setSeverityData(severity);
    setThreatTypes(types);
  };

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? 
      <TrendingUp className="w-3 h-3 text-red-400" /> : 
      <TrendingDown className="w-3 h-3 text-green-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Threat Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Trends */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Threat Detection Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Threat Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Threat Types Analysis */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Top Threat Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threatTypes.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium text-white">
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{threat.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-white">{threat.count}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(threat.trend)}
                    <span className={`text-sm ${threat.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {threat.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatAnalytics;
