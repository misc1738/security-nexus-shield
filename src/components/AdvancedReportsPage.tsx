import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, Calendar as CalendarIcon, Filter, Eye, Share, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'compliance' | 'operational' | 'executive';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'failed' | 'scheduled';
  size: string;
  recipients: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'compliance' | 'operational' | 'executive';
  sections: ReportSection[];
  parameters: ReportParameter[];
}

interface ReportSection {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'summary' | 'text';
  dataSource: string;
  required: boolean;
}

interface ReportParameter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'text';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

const AdvancedReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  useEffect(() => {
    // Initialize with mock data
    setReports([
      {
        id: 'RPT-001',
        name: 'Monthly Security Summary',
        description: 'Comprehensive security metrics and incident summary',
        type: 'security',
        format: 'pdf',
        schedule: 'monthly',
        lastGenerated: '2024-01-15T10:00:00Z',
        status: 'ready',
        size: '2.4 MB',
        recipients: ['ciso@company.com', 'security-team@company.com']
      },
      {
        id: 'RPT-002',
        name: 'Compliance Audit Report',
        description: 'ISO 27001 compliance status and findings',
        type: 'compliance',
        format: 'pdf',
        schedule: 'quarterly',
        lastGenerated: '2024-01-10T14:30:00Z',
        status: 'ready',
        size: '5.1 MB',
        recipients: ['compliance@company.com', 'audit@company.com']
      },
      {
        id: 'RPT-003',
        name: 'Executive Dashboard',
        description: 'High-level security metrics for leadership',
        type: 'executive',
        format: 'pdf',
        schedule: 'weekly',
        lastGenerated: '2024-01-14T09:00:00Z',
        status: 'generating',
        size: '1.2 MB',
        recipients: ['ceo@company.com', 'cto@company.com']
      }
    ]);

    setTemplates([
      {
        id: 'TPL-001',
        name: 'Security Incident Report',
        description: 'Detailed analysis of security incidents',
        category: 'security',
        sections: [
          {
            id: 'SEC-001',
            name: 'Executive Summary',
            type: 'summary',
            dataSource: 'incidents',
            required: true
          },
          {
            id: 'SEC-002',
            name: 'Incident Timeline',
            type: 'table',
            dataSource: 'incident_events',
            required: true
          },
          {
            id: 'SEC-003',
            name: 'Threat Analysis',
            type: 'chart',
            dataSource: 'threat_data',
            required: false
          }
        ],
        parameters: [
          {
            id: 'date_range',
            name: 'Date Range',
            type: 'date',
            required: true
          },
          {
            id: 'severity',
            name: 'Severity Level',
            type: 'multiselect',
            required: false,
            options: ['Low', 'Medium', 'High', 'Critical']
          }
        ]
      },
      {
        id: 'TPL-002',
        name: 'Compliance Assessment',
        description: 'Comprehensive compliance framework assessment',
        category: 'compliance',
        sections: [
          {
            id: 'COMP-001',
            name: 'Framework Overview',
            type: 'summary',
            dataSource: 'compliance_frameworks',
            required: true
          },
          {
            id: 'COMP-002',
            name: 'Control Status',
            type: 'table',
            dataSource: 'compliance_controls',
            required: true
          },
          {
            id: 'COMP-003',
            name: 'Gap Analysis',
            type: 'chart',
            dataSource: 'compliance_gaps',
            required: true
          }
        ],
        parameters: [
          {
            id: 'framework',
            name: 'Compliance Framework',
            type: 'select',
            required: true,
            options: ['ISO 27001', 'SOX', 'GDPR', 'NIST']
          }
        ]
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'generating': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'scheduled': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'compliance': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'operational': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'executive': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const generateReport = (templateId: string) => {
    console.log(`Generating report from template: ${templateId}`);
    // In a real implementation, this would trigger report generation
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-400" />
            Advanced Reports
          </h1>
          <p className="text-slate-400">Generate comprehensive security and compliance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Report Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{report.name}</h4>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Format: {report.format.toUpperCase()}</span>
                          <span>Size: {report.size}</span>
                          <span>Schedule: {report.schedule}</span>
                          <span>Last Generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {report.recipients.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Recipients:</span>
                        {report.recipients.map((recipient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {recipient}
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

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200">{template.name}</CardTitle>
                    <Badge className={getTypeColor(template.category)}>
                      {template.category.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{template.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Sections ({template.sections.length})</h4>
                    <div className="space-y-1">
                      {template.sections.slice(0, 3).map((section) => (
                        <div key={section.id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">{section.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {section.type}
                          </Badge>
                        </div>
                      ))}
                      {template.sections.length > 3 && (
                        <p className="text-xs text-slate-400">+{template.sections.length - 3} more sections</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Parameters ({template.parameters.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.parameters.map((param) => (
                        <Badge key={param.id} variant="outline" className="text-xs">
                          {param.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => generateReport(template.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Report Name</label>
                  <Input className="bg-slate-700 border-slate-600 text-white" placeholder="Enter report name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Report Type</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Output Format</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Report Sections</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Executive Summary',
                    'Security Metrics',
                    'Incident Analysis',
                    'Threat Intelligence',
                    'Compliance Status',
                    'Risk Assessment',
                    'Vulnerability Report',
                    'Network Analysis'
                  ].map((section) => (
                    <div key={section} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-slate-600" />
                      <label className="text-sm text-slate-300">{section}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  Save Template
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.schedule !== 'manual').map((report) => (
                  <div key={report.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{report.name}</h4>
                        <p className="text-xs text-slate-400">
                          Runs {report.schedule} • Next: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedReportsPage;