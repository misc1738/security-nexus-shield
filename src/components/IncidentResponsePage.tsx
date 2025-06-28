import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Users, FileText, CheckCircle, Play, Pause, MessageSquare } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  affectedAssets: string[];
  timeline: IncidentEvent[];
  playbook?: string;
}

interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'detection' | 'action' | 'communication' | 'escalation';
  description: string;
  user: string;
}

const IncidentResponsePage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Initialize with mock incidents
    setIncidents([
      {
        id: 'INC-001',
        title: 'Ransomware Detection on Finance Network',
        severity: 'critical',
        status: 'investigating',
        assignee: 'John Smith',
        reporter: 'Security System',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        description: 'Multiple endpoints in finance network showing signs of ransomware encryption',
        affectedAssets: ['WS-FINANCE-01', 'WS-FINANCE-02', 'SRV-FILE-01'],
        timeline: [
          {
            id: '1',
            timestamp: '2024-01-15T10:30:00Z',
            type: 'detection',
            description: 'Automated detection of suspicious file encryption activity',
            user: 'System'
          },
          {
            id: '2',
            timestamp: '2024-01-15T10:35:00Z',
            type: 'action',
            description: 'Isolated affected endpoints from network',
            user: 'John Smith'
          }
        ],
        playbook: 'Ransomware Response Playbook v2.1'
      }
    ]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'investigating': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'contained': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-red-400" />
            Incident Response
          </h1>
          <p className="text-slate-400">Manage and track security incidents</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Play className="w-4 h-4 mr-2" />
          Create Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents List */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{incident.id}</span>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{incident.title}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">{incident.assignee}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Incident Details */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200">{selectedIncident.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(selectedIncident.severity)}>
                        {selectedIncident.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Assignee</label>
                      <Select defaultValue={selectedIncident.assignee}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                          <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Status</label>
                      <Select defaultValue={selectedIncident.status}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="investigating">Investigating</SelectItem>
                          <SelectItem value="contained">Contained</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <Textarea
                      defaultValue={selectedIncident.description}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Affected Assets</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedIncident.affectedAssets.map((asset) => (
                        <Badge key={asset} className="bg-blue-500/20 text-blue-400 border-blue-500">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedIncident.playbook && (
                    <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400">Following: {selectedIncident.playbook}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Incident Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedIncident.timeline.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{event.description}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">by {event.user}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add timeline entry..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-slate-400">Select an incident to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentResponsePage;