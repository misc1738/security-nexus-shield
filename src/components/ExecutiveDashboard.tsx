import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, DollarSign, Users, Target, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ExecutiveMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'security' | 'compliance' | 'financial' | 'operational';
}

interface RiskIndicator {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  impact: string;
}

const ExecutiveDashboard = () => {
  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);

  useEffect(() => {
    setMetrics([
      {
        id: 'security_score',
        name: 'Overall Security Score',
        value: 87,
        previousValue: 82,
        unit: '%',
        trend: 'up',
        category: 'security'
      },
      {
        id: 'compliance_rate',
        name: 'Compliance Rate',
        value: 94,
        previousValue: 91,
        unit: '%',
        trend: 'up',
        category: 'compliance'
      },
      {
        id: 'mttr',
        name: 'Mean Time to Response',
        value: 23,
        previousValue: 31,
        unit: 'min',
        trend: 'down',
        category: 'operational'
      },
      {
        id: 'security_investment',
        name: 'Security Investment ROI',
        value: 312,
        previousValue: 287,
        unit: '%',
        trend: 'up',
        category: 'financial'
      }
    ]);

    setRiskIndicators([
      {
        id: 'cyber_risk',
        name: 'Cyber Risk Exposure',
        level: 'medium',
        score: 6.2,
        trend: 'improving',
        impact: 'Potential data breach affecting 10K+ records'
      },
      {
        id: 'compliance_risk',
        name: 'Regulatory Compliance Risk',
        level: 'low',
        score: 2.8,
        trend: 'stable',
        impact: 'Minor compliance gaps in SOX controls'
      },
      {
        id: 'operational_risk',
        name: 'Operational Security Risk',
        level: 'high',
        score: 7.8,
        trend: 'deteriorating',
        impact: 'Critical vulnerabilities in production systems'
      }
    ]);
  }, []);

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      trend === 'down' ? 
      <TrendingDown className="w-4 h-4 text-red-400" /> :
      <div className="w-4 h-4" />;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const generateSecurityTrendData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      securityScore: Math.floor(Math.random() * 20) + 75,
      incidents: Math.floor(Math.random() * 15) + 5,
      compliance: Math.floor(Math.random() * 10) + 85
    }));
  };

  const generateCostBenefitData = () => {
    return [
      { category: 'Prevention', investment: 2.5, savings: 8.2 },
      { category: 'Detection', investment: 1.8, savings: 5.4 },
      { category: 'Response', investment: 1.2, savings: 3.8 },
      { category: 'Recovery', investment: 0.8, savings: 2.1 }
    ];
  };

  const generateComplianceData = () => {
    return [
      { framework: 'ISO 27001', compliance: 94, color: '#22c55e' },
      { framework: 'SOX', compliance: 87, color: '#3b82f6' },
      { framework: 'GDPR', compliance: 91, color: '#8b5cf6' },
      { framework: 'NIST', compliance: 89, color: '#f59e0b' }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-gold-400" />
            Executive Dashboard
          </h1>
          <p className="text-slate-400">Strategic security overview for leadership</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500">
            Security Posture: Strong
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{metric.name}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {metric.value}{metric.unit}
                </span>
                <span className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                  {Math.abs(metric.value - metric.previousValue)}{metric.unit}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="financial">Financial Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Security Trends (12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateSecurityTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Line type="monotone" dataKey="securityScore" stroke="#22c55e" strokeWidth={3} />
                    <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskIndicators.map((risk) => (
                    <div key={risk.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{risk.name}</span>
                        <Badge className={getRiskColor(risk.level)}>
                          {risk.level.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-white">{risk.score}/10</span>
                        <Progress value={risk.score * 10} className="flex-1 h-2" />
                      </div>
                      <p className="text-xs text-slate-400">{risk.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Risk Heat Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`h-12 rounded flex items-center justify-center text-xs font-medium ${
                        i < 3 ? 'bg-green-500/20 text-green-400' :
                        i < 6 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {i < 3 ? 'Low' : i < 6 ? 'Med' : 'High'}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Risk Mitigation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Critical Vulnerabilities</span>
                      <span className="text-white">8/12 Resolved</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Compliance Gaps</span>
                      <span className="text-white">15/18 Addressed</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Security Training</span>
                      <span className="text-white">247/280 Completed</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Compliance Framework Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateComplianceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="framework" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="compliance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Audit Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">92%</div>
                    <p className="text-slate-400">Overall Audit Readiness</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Documentation</span>
                      <span className="text-sm text-green-400">Complete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Evidence Collection</span>
                      <span className="text-sm text-green-400">Complete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Control Testing</span>
                      <span className="text-sm text-orange-400">In Progress</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Security Investment ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateCostBenefitData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="investment" fill="#ef4444" name="Investment ($M)" />
                    <Bar dataKey="savings" fill="#22c55e" name="Savings ($M)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Cost Avoidance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">$12.4M</div>
                    <p className="text-slate-400">Total Cost Avoidance (YTD)</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">Breach Prevention</span>
                      <span className="text-sm text-white">$8.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">Compliance Fines</span>
                      <span className="text-sm text-white">$2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">Downtime Prevention</span>
                      <span className="text-sm text-white">$1.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">Reputation Protection</span>
                      <span className="text-sm text-white">$0.3M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;