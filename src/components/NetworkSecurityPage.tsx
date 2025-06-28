import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Shield, AlertTriangle, Activity, Wifi, Lock, Eye, Settings } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface NetworkDevice {
  id: string;
  name: string;
  type: 'firewall' | 'switch' | 'router' | 'access-point' | 'ids' | 'proxy';
  ip: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  location: string;
  lastSeen: string;
  throughput: number;
  connections: number;
  alerts: number;
}

interface NetworkFlow {
  id: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  bytes: number;
  packets: number;
  duration: number;
  classification: 'normal' | 'suspicious' | 'malicious';
  timestamp: string;
}

interface SecurityRule {
  id: string;
  name: string;
  type: 'firewall' | 'ids' | 'proxy';
  action: 'allow' | 'deny' | 'alert';
  source: string;
  destination: string;
  port: string;
  protocol: string;
  enabled: boolean;
  hits: number;
  lastTriggered: string;
}

const NetworkSecurityPage = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [rules, setRules] = useState<SecurityRule[]>([]);

  useEffect(() => {
    // Initialize with mock data
    setDevices([
      {
        id: 'FW-001',
        name: 'Main Firewall',
        type: 'firewall',
        ip: '192.168.1.1',
        status: 'online',
        location: 'Data Center',
        lastSeen: '2024-01-15T15:30:00Z',
        throughput: 85.2,
        connections: 1247,
        alerts: 3
      },
      {
        id: 'SW-001',
        name: 'Core Switch',
        type: 'switch',
        ip: '192.168.1.10',
        status: 'online',
        location: 'Data Center',
        lastSeen: '2024-01-15T15:29:00Z',
        throughput: 67.8,
        connections: 2156,
        alerts: 0
      },
      {
        id: 'IDS-001',
        name: 'Intrusion Detection System',
        type: 'ids',
        ip: '192.168.1.50',
        status: 'warning',
        location: 'DMZ',
        lastSeen: '2024-01-15T15:25:00Z',
        throughput: 45.3,
        connections: 0,
        alerts: 12
      }
    ]);

    setFlows([
      {
        id: 'FLOW-001',
        sourceIp: '192.168.1.100',
        destinationIp: '8.8.8.8',
        sourcePort: 54321,
        destinationPort: 53,
        protocol: 'UDP',
        bytes: 1024,
        packets: 2,
        duration: 0.5,
        classification: 'normal',
        timestamp: '2024-01-15T15:30:00Z'
      },
      {
        id: 'FLOW-002',
        sourceIp: '192.168.1.150',
        destinationIp: '185.220.101.182',
        sourcePort: 49152,
        destinationPort: 9001,
        protocol: 'TCP',
        bytes: 15360,
        packets: 24,
        duration: 120.5,
        classification: 'suspicious',
        timestamp: '2024-01-15T15:28:00Z'
      }
    ]);

    setRules([
      {
        id: 'RULE-001',
        name: 'Block Tor Exit Nodes',
        type: 'firewall',
        action: 'deny',
        source: 'any',
        destination: 'tor_exit_nodes',
        port: 'any',
        protocol: 'any',
        enabled: true,
        hits: 47,
        lastTriggered: '2024-01-15T14:22:00Z'
      },
      {
        id: 'RULE-002',
        name: 'Alert on Suspicious DNS',
        type: 'ids',
        action: 'alert',
        source: 'internal',
        destination: 'external',
        port: '53',
        protocol: 'UDP',
        enabled: true,
        hits: 156,
        lastTriggered: '2024-01-15T15:15:00Z'
      }
    ]);
  }, []);

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'offline': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getFlowClassificationColor = (classification: string) => {
    switch (classification) {
      case 'normal': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'suspicious': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'malicious': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'firewall': return <Shield className="w-4 h-4" />;
      case 'switch': return <Activity className="w-4 h-4" />;
      case 'router': return <Globe className="w-4 h-4" />;
      case 'access-point': return <Wifi className="w-4 h-4" />;
      case 'ids': return <Eye className="w-4 h-4" />;
      case 'proxy': return <Lock className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const generateNetworkTrafficData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i.toString().padStart(2, '0') + ':00',
      inbound: Math.floor(Math.random() * 1000) + 200,
      outbound: Math.floor(Math.random() * 800) + 150,
      blocked: Math.floor(Math.random() * 50) + 5
    }));
  };

  const generateThreatData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      intrusions: Math.floor(Math.random() * 20) + 5,
      malware: Math.floor(Math.random() * 15) + 2,
      ddos: Math.floor(Math.random() * 5),
      blocked: Math.floor(Math.random() * 100) + 50
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-blue-400" />
            Network Security
          </h1>
          <p className="text-slate-400">Monitor and secure network infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500">
            Network Healthy
          </Badge>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Network Devices</p>
                <p className="text-2xl font-bold text-white">{devices.length}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Connections</p>
                <p className="text-2xl font-bold text-green-400">
                  {devices.reduce((sum, d) => sum + d.connections, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Security Alerts</p>
                <p className="text-2xl font-bold text-orange-400">
                  {devices.reduce((sum, d) => sum + d.alerts, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Throughput</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(devices.reduce((sum, d) => sum + d.throughput, 0) / devices.length).toFixed(1)}%
                </p>
              </div>
              <Wifi className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="devices">Network Devices</TabsTrigger>
          <TabsTrigger value="flows">Network Flows</TabsTrigger>
          <TabsTrigger value="rules">Security Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <CardTitle className="text-slate-200">{device.name}</CardTitle>
                    </div>
                    <Badge className={getDeviceStatusColor(device.status)}>
                      {device.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white ml-2 capitalize">{device.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">IP:</span>
                      <span className="text-white ml-2">{device.ip}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Location:</span>
                      <span className="text-white ml-2">{device.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Connections:</span>
                      <span className="text-white ml-2">{device.connections.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Throughput</span>
                      <span className="text-white">{device.throughput}%</span>
                    </div>
                    <Progress value={device.throughput} className="h-2" />
                  </div>

                  {device.alerts > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-400">{device.alerts} active alerts</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-500">
                    Last seen: {new Date(device.lastSeen).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Network Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flows.map((flow) => (
                  <div key={flow.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {flow.sourceIp}:{flow.sourcePort} → {flow.destinationIp}:{flow.destinationPort}
                        </span>
                        <Badge className={getFlowClassificationColor(flow.classification)}>
                          {flow.classification.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {flow.protocol}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(flow.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-xs text-slate-400">
                      <div>
                        <span>Bytes: </span>
                        <span className="text-white">{flow.bytes.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Packets: </span>
                        <span className="text-white">{flow.packets}</span>
                      </div>
                      <div>
                        <span>Duration: </span>
                        <span className="text-white">{flow.duration}s</span>
                      </div>
                      <div>
                        <span>Protocol: </span>
                        <span className="text-white">{flow.protocol}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Security Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{rule.name}</span>
                        <Badge className={rule.enabled ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-gray-500/20 text-gray-400 border-gray-500'}>
                          {rule.enabled ? 'ENABLED' : 'DISABLED'}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rule.type}
                        </Badge>
                        <Badge className={
                          rule.action === 'deny' ? 'bg-red-500/20 text-red-400 border-red-500' :
                          rule.action === 'alert' ? 'bg-orange-500/20 text-orange-400 border-orange-500' :
                          'bg-green-500/20 text-green-400 border-green-500'
                        }>
                          {rule.action.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {rule.hits} hits
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-xs text-slate-400">
                      <div>
                        <span>Source: </span>
                        <span className="text-white">{rule.source}</span>
                      </div>
                      <div>
                        <span>Destination: </span>
                        <span className="text-white">{rule.destination}</span>
                      </div>
                      <div>
                        <span>Port: </span>
                        <span className="text-white">{rule.port}</span>
                      </div>
                      <div>
                        <span>Protocol: </span>
                        <span className="text-white">{rule.protocol}</span>
                      </div>
                    </div>
                    
                    {rule.lastTriggered && (
                      <div className="text-xs text-slate-500 mt-2">
                        Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Network Traffic (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={generateNetworkTrafficData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Area type="monotone" dataKey="inbound" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="outbound" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="blocked" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Security Events (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateThreatData()}>
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
                    <Line type="monotone" dataKey="intrusions" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="malware" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="ddos" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkSecurityPage;