
import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DetectionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const detections = [
    {
      id: 1,
      threat: "Trojan.GenKrypter",
      computer: "WS-MARKETING-05",
      user: "john.doe",
      severity: "high",
      status: "active",
      detected: "2024-01-15 14:32:15",
      hash: "a1b2c3d4e5f6789012345678901234567890abcd",
      path: "C:\\Users\\john.doe\\Downloads\\suspicious.exe"
    },
    {
      id: 2,
      threat: "Suspicious Network Activity",
      computer: "SRV-DATABASE-01",
      user: "system",
      severity: "medium",
      status: "investigating",
      detected: "2024-01-15 14:17:42",
      hash: "e5f6789012345678901234567890abcda1b2c3d4",
      path: "Network connection to 192.168.1.100:4444"
    },
    {
      id: 3,
      threat: "Potentially Unwanted Application",
      computer: "WS-HR-12",
      user: "sarah.smith",
      severity: "low",
      status: "quarantined",
      detected: "2024-01-15 13:58:31",
      hash: "789012345678901234567890abcda1b2c3d4e5f6",
      path: "C:\\Program Files\\AdwareTool\\adware.dll"
    },
    {
      id: 4,
      threat: "Malicious URL Blocked",
      computer: "WS-FINANCE-08",
      user: "mike.johnson",
      severity: "medium",
      status: "blocked",
      detected: "2024-01-15 13:32:18",
      hash: "N/A",
      path: "https://malicious-site.example.com/payload.php"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'investigating': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'quarantined': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'blocked': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         detection.computer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || detection.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Detections</h1>
          <p className="text-slate-400">Monitor and investigate security threats</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/20 text-red-400 border-red-500">
            {detections.filter(d => d.status === 'active').length} Active
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
            {detections.length} Total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search detections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detections Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Detection Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr className="text-left">
                  <th className="p-4 text-sm font-medium text-slate-300">Threat</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Computer</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Severity</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Status</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Detected</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetections.map((detection) => (
                  <tr key={detection.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{detection.threat}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{detection.path}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-white">{detection.computer}</p>
                        <p className="text-xs text-slate-400">{detection.user}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getSeverityColor(detection.severity)}>
                        {detection.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(detection.status)}>
                        {detection.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{detection.detected}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 hover:border-blue-500">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 hover:border-green-500">
                          <Shield className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 hover:border-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionsPage;
