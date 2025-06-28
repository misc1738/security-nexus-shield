import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Target, Play, Pause, Save, Download, Eye, AlertTriangle } from 'lucide-react';

interface HuntingQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  dataSource: string;
  category: 'malware' | 'lateral-movement' | 'data-exfiltration' | 'persistence' | 'privilege-escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  author: string;
  createdAt: string;
  lastRun: string;
  status: 'draft' | 'active' | 'archived';
  results?: HuntingResult[];
}

interface HuntingResult {
  id: string;
  timestamp: string;
  deviceId: string;
  userId?: string;
  processName?: string;
  commandLine?: string;
  networkConnection?: string;
  fileHash?: string;
  riskScore: number;
  context: Record<string, any>;
}

interface HuntingCampaign {
  id: string;
  name: string;
  description: string;
  queries: string[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  findings: number;
  investigator: string;
}

const ThreatHuntingPage = () => {
  const [queries, setQueries] = useState<HuntingQuery[]>([]);
  const [campaigns, setCampaigns] = useState<HuntingCampaign[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<HuntingQuery | null>(null);
  const [newQuery, setNewQuery] = useState({
    name: '',
    description: '',
    query: '',
    dataSource: 'logs',
    category: 'malware' as const,
    severity: 'medium' as const
  });

  useEffect(() => {
    // Initialize with mock data
    setQueries([
      {
        id: 'HUNT-001',
        name: 'Suspicious PowerShell Activity',
        description: 'Detect PowerShell commands with base64 encoding and download capabilities',
        query: 'process_name:"powershell.exe" AND (command_line:*base64* OR command_line:*downloadstring*)',
        dataSource: 'endpoint_logs',
        category: 'malware',
        severity: 'high',
        author: 'Security Team',
        createdAt: '2024-01-10T10:00:00Z',
        lastRun: '2024-01-15T14:30:00Z',
        status: 'active',
        results: [
          {
            id: 'RES-001',
            timestamp: '2024-01-15T14:25:00Z',
            deviceId: 'WS-FINANCE-08',
            userId: 'john.doe',
            processName: 'powershell.exe',
            commandLine: 'powershell.exe -enc SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0AA==',
            riskScore: 8.5,
            context: {
              parentProcess: 'winword.exe',
              networkConnections: ['192.168.1.100:443']
            }
          }
        ]
      },
      {
        id: 'HUNT-002',
        name: 'Lateral Movement via WMI',
        description: 'Identify potential lateral movement using WMI remote execution',
        query: 'process_name:"wmic.exe" AND command_line:*/node:* AND command_line:*process*',
        dataSource: 'endpoint_logs',
        category: 'lateral-movement',
        severity: 'high',
        author: 'Threat Hunter',
        createdAt: '2024-01-12T09:15:00Z',
        lastRun: '2024-01-15T12:00:00Z',
        status: 'active'
      }
    ]);

    setCampaigns([
      {
        id: 'CAMP-001',
        name: 'APT29 Hunting Campaign',
        description: 'Proactive hunt for APT29 TTPs based on recent threat intelligence',
        queries: ['HUNT-001', 'HUNT-002'],
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        findings: 3,
        investigator: 'Senior Threat Hunter'
      }
    ]);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'malware': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'lateral-movement': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'data-exfiltration': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'persistence': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'privilege-escalation': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'archived': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'paused': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const runQuery = (queryId: string) => {
    console.log(`Running query: ${queryId}`);
    // In a real implementation, this would execute the query against the data source
  };

  const saveQuery = () => {
    const query: HuntingQuery = {
      id: `HUNT-${Date.now()}`,
      ...newQuery,
      author: 'Current User',
      createdAt: new Date().toISOString(),
      lastRun: '',
      status: 'draft'
    };
    
    setQueries([...queries, query]);
    setNewQuery({
      name: '',
      description: '',
      query: '',
      dataSource: 'logs',
      category: 'malware',
      severity: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-400" />
            Threat Hunting
          </h1>
          <p className="text-slate-400">Proactively search for threats and suspicious activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Play className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <Tabs defaultValue="queries" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="queries">Hunting Queries</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="builder">Query Builder</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="queries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queries List */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Hunting Queries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {queries.map((query) => (
                    <div
                      key={query.id}
                      onClick={() => setSelectedQuery(query)}
                      className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{query.name}</span>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{query.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(query.category)}>
                          {query.category.toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(query.severity)}>
                          {query.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Query Details */}
            <div className="lg:col-span-2">
              {selectedQuery ? (
                <div className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-200">{selectedQuery.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Play className="w-3 h-3 mr-1" />
                            Run
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300">{selectedQuery.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-300">Data Source</label>
                          <p className="text-sm text-slate-400">{selectedQuery.dataSource}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-300">Author</label>
                          <p className="text-sm text-slate-400">{selectedQuery.author}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-300">Last Run</label>
                          <p className="text-sm text-slate-400">
                            {selectedQuery.lastRun ? new Date(selectedQuery.lastRun).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-300">Created</label>
                          <p className="text-sm text-slate-400">
                            {new Date(selectedQuery.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-300">Query</label>
                        <div className="mt-1 p-3 bg-slate-900 rounded-lg border border-slate-600">
                          <code className="text-sm text-green-400 font-mono">{selectedQuery.query}</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results */}
                  {selectedQuery.results && selectedQuery.results.length > 0 && (
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-slate-200">Query Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedQuery.results.map((result) => (
                            <div key={result.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                                  <span className="text-sm font-medium text-white">{result.deviceId}</span>
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500">
                                    Risk: {result.riskScore}/10
                                  </Badge>
                                </div>
                                <span className="text-xs text-slate-400">
                                  {new Date(result.timestamp).toLocaleString()}
                                </span>
                              </div>
                              
                              {result.commandLine && (
                                <div className="mb-2">
                                  <label className="text-xs text-slate-400">Command Line:</label>
                                  <code className="block text-xs text-green-400 font-mono bg-slate-900 p-2 rounded mt-1">
                                    {result.commandLine}
                                  </code>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                {result.userId && (
                                  <div>
                                    <span className="text-slate-400">User: </span>
                                    <span className="text-white">{result.userId}</span>
                                  </div>
                                )}
                                {result.processName && (
                                  <div>
                                    <span className="text-slate-400">Process: </span>
                                    <span className="text-white">{result.processName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="flex items-center justify-center h-64">
                    <p className="text-slate-400">Select a query to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Hunting Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-white">{campaign.name}</h4>
                        <p className="text-xs text-slate-400">{campaign.description}</p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-white">{campaign.queries.length}</p>
                        <p className="text-xs text-slate-400">Queries</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-400">{campaign.findings}</p>
                        <p className="text-xs text-slate-400">Findings</p>
                      </div>
                      <div>
                        <p className="text-sm text-white">{campaign.investigator}</p>
                        <p className="text-xs text-slate-400">Investigator</p>
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400">Started</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Query Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Query Name</label>
                  <Input
                    value={newQuery.name}
                    onChange={(e) => setNewQuery({...newQuery, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter query name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Data Source</label>
                  <Select value={newQuery.dataSource} onValueChange={(value) => setNewQuery({...newQuery, dataSource: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="endpoint_logs">Endpoint Logs</SelectItem>
                      <SelectItem value="network_logs">Network Logs</SelectItem>
                      <SelectItem value="dns_logs">DNS Logs</SelectItem>
                      <SelectItem value="proxy_logs">Proxy Logs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <Select value={newQuery.category} onValueChange={(value: any) => setNewQuery({...newQuery, category: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="lateral-movement">Lateral Movement</SelectItem>
                      <SelectItem value="data-exfiltration">Data Exfiltration</SelectItem>
                      <SelectItem value="persistence">Persistence</SelectItem>
                      <SelectItem value="privilege-escalation">Privilege Escalation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Severity</label>
                  <Select value={newQuery.severity} onValueChange={(value: any) => setNewQuery({...newQuery, severity: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Description</label>
                <Textarea
                  value={newQuery.description}
                  onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe what this query detects"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Query</label>
                <Textarea
                  value={newQuery.query}
                  onChange={(e) => setNewQuery({...newQuery, query: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white font-mono"
                  placeholder="Enter your hunting query (KQL, SQL, or custom syntax)"
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Play className="w-4 h-4 mr-2" />
                  Test Query
                </Button>
                <Button onClick={saveQuery} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Query
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Hunt Results Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No hunt results to display</p>
                <p className="text-sm text-slate-500">Run some queries to see results here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThreatHuntingPage;