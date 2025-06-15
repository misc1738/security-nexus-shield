
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Users, Activity, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const securityMetrics = {
    totalEndpoints: 1247,
    protectedEndpoints: 1198,
    activeThreats: 12,
    resolvedThreats: 89,
    complianceScore: 94
  };

  const recentDetections = [
    { id: 1, threat: "Trojan.GenKrypter", computer: "WS-MARKETING-05", severity: "high", time: "2 min ago" },
    { id: 2, threat: "Suspicious Network Activity", computer: "SRV-DATABASE-01", severity: "medium", time: "15 min ago" },
    { id: 3, threat: "Potentially Unwanted Application", computer: "WS-HR-12", severity: "low", time: "32 min ago" },
    { id: 4, threat: "Malicious URL Blocked", computer: "WS-FINANCE-08", severity: "medium", time: "1 hour ago" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Endpoints</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{securityMetrics.totalEndpoints.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              {securityMetrics.protectedEndpoints} protected
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Threats</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{securityMetrics.activeThreats}</div>
            <p className="text-xs text-slate-400">
              {securityMetrics.resolvedThreats} resolved today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Protection Status</CardTitle>
            <Shield className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {((securityMetrics.protectedEndpoints / securityMetrics.totalEndpoints) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-400">
              {securityMetrics.totalEndpoints - securityMetrics.protectedEndpoints} unprotected
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Compliance Score</CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{securityMetrics.complianceScore}%</div>
            <Progress value={securityMetrics.complianceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Detections */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Detections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDetections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(detection.severity)}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{detection.threat}</p>
                      <p className="text-xs text-slate-400">{detection.computer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`${getSeverityTextColor(detection.severity)} border-current`}>
                      {detection.severity.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">{detection.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Agent Updates</span>
                <Badge className="bg-green-500/20 text-green-400">Current</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Database</span>
                <Badge className="bg-green-500/20 text-green-400">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">License</span>
                <Badge className="bg-blue-500/20 text-blue-400">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Last Sync</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 min ago
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
