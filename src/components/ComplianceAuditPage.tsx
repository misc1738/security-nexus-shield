import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileCheck, AlertCircle, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
  notApplicableControls: number;
  lastAssessment: string;
  nextAssessment: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
}

interface ComplianceControl {
  id: string;
  framework: string;
  category: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  evidence: string[];
  lastTested: string;
  nextTest: string;
  owner: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditReport {
  id: string;
  name: string;
  framework: string;
  generatedDate: string;
  status: 'draft' | 'final' | 'submitted';
  findings: number;
  recommendations: number;
}

const ComplianceAuditPage = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');

  useEffect(() => {
    // Initialize with mock data
    setFrameworks([
      {
        id: 'iso27001',
        name: 'ISO 27001',
        description: 'Information Security Management System',
        totalControls: 114,
        compliantControls: 89,
        nonCompliantControls: 15,
        notApplicableControls: 10,
        lastAssessment: '2024-01-01',
        nextAssessment: '2024-07-01',
        status: 'partial'
      },
      {
        id: 'nist',
        name: 'NIST Cybersecurity Framework',
        description: 'Framework for Improving Critical Infrastructure Cybersecurity',
        totalControls: 108,
        compliantControls: 95,
        nonCompliantControls: 8,
        notApplicableControls: 5,
        lastAssessment: '2024-01-10',
        nextAssessment: '2024-04-10',
        status: 'compliant'
      },
      {
        id: 'sox',
        name: 'SOX Compliance',
        description: 'Sarbanes-Oxley Act IT Controls',
        totalControls: 45,
        compliantControls: 38,
        nonCompliantControls: 7,
        notApplicableControls: 0,
        lastAssessment: '2023-12-15',
        nextAssessment: '2024-03-15',
        status: 'partial'
      }
    ]);

    setControls([
      {
        id: 'A.5.1.1',
        framework: 'iso27001',
        category: 'Information Security Policies',
        title: 'Policies for information security',
        description: 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.',
        status: 'compliant',
        evidence: ['Policy Document v2.1', 'Management Approval Email', 'Training Records'],
        lastTested: '2024-01-15',
        nextTest: '2024-07-15',
        owner: 'CISO Office',
        riskLevel: 'high'
      },
      {
        id: 'A.8.1.1',
        framework: 'iso27001',
        category: 'Asset Management',
        title: 'Inventory of assets',
        description: 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.',
        status: 'non-compliant',
        evidence: ['Incomplete Asset Register'],
        lastTested: '2024-01-10',
        nextTest: '2024-02-10',
        owner: 'IT Operations',
        riskLevel: 'medium'
      }
    ]);

    setReports([
      {
        id: 'RPT-001',
        name: 'Q4 2023 ISO 27001 Assessment',
        framework: 'iso27001',
        generatedDate: '2024-01-15',
        status: 'final',
        findings: 15,
        recommendations: 8
      },
      {
        id: 'RPT-002',
        name: 'NIST Framework Review',
        framework: 'nist',
        generatedDate: '2024-01-10',
        status: 'draft',
        findings: 8,
        recommendations: 5
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'non-compliant': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'partial': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'not-assessed': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'not-applicable': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getComplianceData = () => {
    return frameworks.map(framework => ({
      name: framework.name,
      compliant: framework.compliantControls,
      nonCompliant: framework.nonCompliantControls,
      notApplicable: framework.notApplicableControls
    }));
  };

  const getOverallComplianceData = () => {
    const total = frameworks.reduce((sum, f) => sum + f.totalControls, 0);
    const compliant = frameworks.reduce((sum, f) => sum + f.compliantControls, 0);
    const nonCompliant = frameworks.reduce((sum, f) => sum + f.nonCompliantControls, 0);
    const notApplicable = frameworks.reduce((sum, f) => sum + f.notApplicableControls, 0);

    return [
      { name: 'Compliant', value: compliant, color: '#22c55e' },
      { name: 'Non-Compliant', value: nonCompliant, color: '#ef4444' },
      { name: 'Not Applicable', value: notApplicable, color: '#3b82f6' }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-400" />
            Compliance & Audit
          </h1>
          <p className="text-slate-400">Monitor compliance status and manage audit activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileCheck className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Frameworks</p>
                <p className="text-2xl font-bold text-white">{frameworks.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Compliant Controls</p>
                <p className="text-2xl font-bold text-green-400">
                  {frameworks.reduce((sum, f) => sum + f.compliantControls, 0)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Non-Compliant</p>
                <p className="text-2xl font-bold text-red-400">
                  {frameworks.reduce((sum, f) => sum + f.nonCompliantControls, 0)}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-400">12</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {frameworks.map((framework) => (
              <Card key={framework.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200">{framework.name}</CardTitle>
                    <Badge className={getStatusColor(framework.status)}>
                      {framework.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{framework.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Compliance Progress</span>
                      <span className="text-white">
                        {Math.round((framework.compliantControls / framework.totalControls) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(framework.compliantControls / framework.totalControls) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">{framework.compliantControls}</p>
                      <p className="text-xs text-slate-400">Compliant</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-400">{framework.nonCompliantControls}</p>
                      <p className="text-xs text-slate-400">Non-Compliant</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-400">{framework.notApplicableControls}</p>
                      <p className="text-xs text-slate-400">N/A</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Last Assessment: {new Date(framework.lastAssessment).toLocaleDateString()}</span>
                      <span>Next: {new Date(framework.nextAssessment).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Compliance Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {controls.map((control) => (
                  <div key={control.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{control.id}</span>
                          <Badge className={getStatusColor(control.status)}>
                            {control.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {control.framework.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium text-slate-200 mb-1">{control.title}</h4>
                        <p className="text-xs text-slate-400 mb-2">{control.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Owner: {control.owner}</span>
                          <span>Last Tested: {new Date(control.lastTested).toLocaleDateString()}</span>
                          <span>Next Test: {new Date(control.nextTest).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {control.evidence.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {control.evidence.map((evidence, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {evidence}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div>
                      <h4 className="text-sm font-medium text-white">{report.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span>Framework: {report.framework.toUpperCase()}</span>
                        <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                        <span>{report.findings} findings</span>
                        <span>{report.recommendations} recommendations</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
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
                <CardTitle className="text-slate-200">Compliance by Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getComplianceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="compliant" fill="#22c55e" />
                    <Bar dataKey="nonCompliant" fill="#ef4444" />
                    <Bar dataKey="notApplicable" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Overall Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getOverallComplianceData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getOverallComplianceData().map((entry, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceAuditPage;