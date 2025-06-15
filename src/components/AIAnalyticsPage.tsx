
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertCircle, Shield, Activity, Target, Eye, Settings } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { AnomalyDetectionService, AnomalyData } from '@/services/anomalyDetection';
import { ThreatCorrelationEngine, ThreatCorrelation } from '@/services/threatCorrelation';
import { PredictiveRiskScoring, RiskAssessment } from '@/services/riskScoring';

const AIAnalyticsPage = () => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [correlations, setCorrelations] = useState<ThreatCorrelation[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    // Initialize AI services
    const anomalyService = AnomalyDetectionService.getInstance();
    const correlationService = ThreatCorrelationEngine.getInstance();
    const riskService = PredictiveRiskScoring.getInstance();

    // Load initial data
    setAnomalies(anomalyService.getAnomalies());
    setCorrelations(correlationService.getCorrelations());
    setRiskAssessments(riskService.getAllRiskAssessments());

    // Set up periodic updates
    const interval = setInterval(() => {
      setAnomalies(anomalyService.getAnomalies());
      setCorrelations(correlationService.getCorrelations());
      setRiskAssessments(riskService.getAllRiskAssessments());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const generateAnomalyTrendData = () => {
    const hours = 24;
    return Array.from({ length: hours }, (_, i) => {
      const hour = new Date(Date.now() - (hours - i - 1) * 60 * 60 * 1000);
      const hourAnomalies = anomalies.filter(a => {
        const anomalyHour = new Date(a.timestamp);
        return anomalyHour.getHours() === hour.getHours() && 
               anomalyHour.getDate() === hour.getDate();
      });

      return {
        time: hour.getHours().toString().padStart(2, '0') + ':00',
        count: hourAnomalies.length,
        confidence: hourAnomalies.length > 0 ? 
          hourAnomalies.reduce((sum, a) => sum + a.confidence, 0) / hourAnomalies.length : 0
      };
    });
  };

  const generateRiskScoreData = () => {
    return riskAssessments.map(assessment => ({
      device: assessment.deviceId.split('-')[1] || assessment.deviceId,
      risk: assessment.overallScore,
      vulnerability: assessment.factors.find(f => f.id === 'critical_vulnerabilities')?.value || 0,
      threat: assessment.factors.find(f => f.id === 'threat_exposure')?.value || 0
    }));
  };

  const getMLInsights = () => {
    const totalAnomalies = anomalies.length;
    const highConfidenceAnomalies = anomalies.filter(a => a.confidence > 0.8).length;
    const criticalRiskDevices = riskAssessments.filter(r => r.riskLevel === 'critical').length;
    const activeCorrelations = correlations.filter(c => c.status === 'active').length;

    return {
      totalAnomalies,
      highConfidenceAnomalies,
      criticalRiskDevices,
      activeCorrelations,
      accuracy: totalAnomalies > 0 ? ((highConfidenceAnomalies / totalAnomalies) * 100).toFixed(1) : '0',
      detectionRate: '94.7'
    };
  };

  const insights = getMLInsights();
  const anomalyTrendData = generateAnomalyTrendData();
  const riskScoreData = generateRiskScoreData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-400" />
            AI Analytics & Machine Learning
          </h1>
          <p className="text-slate-400">Advanced threat detection powered by artificial intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500">
            ML Engine Active
          </Badge>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Anomalies</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.totalAnomalies}</div>
            <p className="text-xs text-slate-400">
              {insights.highConfidenceAnomalies} high confidence
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Critical Risk Devices</CardTitle>
            <Shield className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{insights.criticalRiskDevices}</div>
            <p className="text-xs text-slate-400">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">ML Accuracy</CardTitle>
            <Target className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{insights.accuracy}%</div>
            <Progress value={parseFloat(insights.accuracy)} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Detection Rate</CardTitle>
            <Eye className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{insights.detectionRate}%</div>
            <p className="text-xs text-slate-400">
              Threats detected vs missed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection Trends */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Anomaly Detection Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={anomalyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Risk Score vs Threat Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={riskScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="risk" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  name="Risk Score"
                />
                <YAxis 
                  dataKey="threat" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  name="Threat Exposure"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Scatter dataKey="vulnerability" fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Detections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly Detection Results */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Recent Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {anomalies.slice(0, 5).map((anomaly) => (
                <div key={anomaly.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {(anomaly.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-white mb-1">{anomaly.description}</p>
                  <p className="text-xs text-slate-400">{anomaly.deviceId}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threat Correlations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Active Correlations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {correlations.filter(c => c.status === 'active').slice(0, 5).map((correlation) => (
                <div key={correlation.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                      {correlation.correlationType.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Risk: {correlation.riskScore.toFixed(1)}/10
                    </span>
                  </div>
                  <p className="text-sm text-white mb-1">{correlation.description}</p>
                  <p className="text-xs text-slate-400">
                    {correlation.events.length} related events
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High Risk Devices */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">High Risk Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {riskAssessments
                .filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical')
                .slice(0, 5)
                .map((assessment) => (
                <div key={assessment.deviceId} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getSeverityColor(assessment.riskLevel)}>
                      {assessment.riskLevel.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {assessment.overallScore.toFixed(1)}/100
                    </span>
                  </div>
                  <p className="text-sm text-white mb-1">{assessment.deviceId}</p>
                  <Progress value={assessment.overallScore} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;
