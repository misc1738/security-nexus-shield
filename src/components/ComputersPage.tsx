
import React, { useState } from 'react';
import { Monitor, Search, Filter, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ComputersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const computers = [
    {
      id: 1,
      name: "WS-MARKETING-05",
      user: "john.doe",
      ip: "192.168.1.15",
      os: "Windows 11 Pro",
      status: "protected",
      lastSeen: "2 min ago",
      threats: 1,
      version: "7.2.1004"
    },
    {
      id: 2,
      name: "SRV-DATABASE-01",
      user: "system",
      ip: "192.168.1.10",
      os: "Windows Server 2022",
      status: "warning",
      lastSeen: "5 min ago",
      threats: 0,
      version: "7.2.1004"
    },
    {
      id: 3,
      name: "WS-HR-12",
      user: "sarah.smith",
      ip: "192.168.1.22",
      os: "Windows 10 Pro",
      status: "protected",
      lastSeen: "1 min ago",
      threats: 0,
      version: "7.2.1004"
    },
    {
      id: 4,
      name: "MBP-DESIGN-03",
      user: "mike.johnson",
      ip: "192.168.1.45",
      os: "macOS Sonoma 14.2",
      status: "offline",
      lastSeen: "2 hours ago",
      threats: 0,
      version: "7.2.1001"
    },
    {
      id: 5,
      name: "UBUNTU-DEV-01",
      user: "dev.team",
      ip: "192.168.1.100",
      os: "Ubuntu 22.04 LTS",
      status: "protected",
      lastSeen: "30 sec ago",
      threats: 0,
      version: "7.2.1004"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'protected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'offline': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'protected': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'offline': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500';
    }
  };

  const getOSIcon = (os: string) => {
    if (os.includes('Windows')) return '🪟';
    if (os.includes('macOS')) return '🍎';
    if (os.includes('Ubuntu') || os.includes('Linux')) return '🐧';
    return '💻';
  };

  const filteredComputers = computers.filter(computer => {
    const matchesSearch = computer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || computer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: computers.length,
    protected: computers.filter(c => c.status === 'protected').length,
    warning: computers.filter(c => c.status === 'warning').length,
    offline: computers.filter(c => c.status === 'offline').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Computers</h1>
          <p className="text-slate-400">Manage and monitor all endpoints</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/20 text-green-400 border-green-500">
            {statusCounts.protected} Protected
          </Badge>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">
            {statusCounts.warning} Warnings
          </Badge>
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500">
            {statusCounts.offline} Offline
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Endpoints</p>
                <p className="text-2xl font-bold text-white">{statusCounts.total}</p>
              </div>
              <Monitor className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Protected</p>
                <p className="text-2xl font-bold text-green-400">{statusCounts.protected}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Warnings</p>
                <p className="text-2xl font-bold text-orange-400">{statusCounts.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Offline</p>
                <p className="text-2xl font-bold text-gray-400">{statusCounts.offline}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search computers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="protected">Protected</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Computers Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Endpoint Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr className="text-left">
                  <th className="p-4 text-sm font-medium text-slate-300">Computer</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Operating System</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Status</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Last Seen</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Threats</th>
                  <th className="p-4 text-sm font-medium text-slate-300">Version</th>
                </tr>
              </thead>
              <tbody>
                {filteredComputers.map((computer) => (
                  <tr key={computer.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(computer.status)}
                        <div>
                          <p className="text-sm font-medium text-white">{computer.name}</p>
                          <p className="text-xs text-slate-400">{computer.user} • {computer.ip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getOSIcon(computer.os)}</span>
                        <span className="text-sm text-slate-300">{computer.os}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(computer.status)}>
                        {computer.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{computer.lastSeen}</td>
                    <td className="p-4">
                      {computer.threats > 0 ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500">
                          {computer.threats}
                        </Badge>
                      ) : (
                        <span className="text-sm text-slate-500">None</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-400">{computer.version}</td>
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

export default ComputersPage;
