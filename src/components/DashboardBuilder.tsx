
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Move, BarChart3, PieChart, Activity, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'status';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: WidgetConfig;
  data?: any[];
}

interface WidgetConfig {
  dataSource: string;
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  metrics?: string[];
  filters?: Record<string, any>;
  refreshInterval?: number;
  color?: string;
  showLegend?: boolean;
  maxItems?: number;
}

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  type: DashboardWidget['type'];
  defaultConfig: WidgetConfig;
}

const DashboardBuilder = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const widgetTemplates: WidgetTemplate[] = [
    {
      id: 'threat_count',
      name: 'Threat Count',
      description: 'Display total number of active threats',
      icon: AlertTriangle,
      type: 'metric',
      defaultConfig: {
        dataSource: 'threats',
        metrics: ['count'],
        color: '#ef4444',
        refreshInterval: 30
      }
    },
    {
      id: 'endpoint_status',
      name: 'Endpoint Status',
      description: 'Show endpoint protection status',
      icon: Shield,
      type: 'chart',
      defaultConfig: {
        dataSource: 'endpoints',
        chartType: 'pie',
        metrics: ['protected', 'unprotected', 'offline'],
        showLegend: true,
        refreshInterval: 60
      }
    },
    {
      id: 'threat_trends',
      name: 'Threat Trends',
      description: 'Display threat detection trends over time',
      icon: TrendingUp,
      type: 'chart',
      defaultConfig: {
        dataSource: 'threats',
        chartType: 'line',
        metrics: ['detections', 'blocked', 'resolved'],
        refreshInterval: 300
      }
    },
    {
      id: 'recent_detections',
      name: 'Recent Detections',
      description: 'List of recent threat detections',
      icon: Activity,
      type: 'list',
      defaultConfig: {
        dataSource: 'detections',
        maxItems: 5,
        refreshInterval: 60
      }
    },
    {
      id: 'severity_breakdown',
      name: 'Severity Breakdown',
      description: 'Breakdown of threats by severity',
      icon: BarChart3,
      type: 'chart',
      defaultConfig: {
        dataSource: 'threats',
        chartType: 'bar',
        metrics: ['critical', 'high', 'medium', 'low'],
        refreshInterval: 120
      }
    },
    {
      id: 'system_health',
      name: 'System Health',
      description: 'Overall system health indicators',
      icon: PieChart,
      type: 'status',
      defaultConfig: {
        dataSource: 'system',
        metrics: ['database', 'agents', 'services'],
        refreshInterval: 60
      }
    }
  ];

  useEffect(() => {
    // Load saved dashboard configuration
    const savedWidgets = localStorage.getItem('dashboard_widgets');
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        setWidgets(parsed);
      } catch (error) {
        console.error('Failed to load saved widgets:', error);
      }
    } else {
      // Initialize with default widgets
      initializeDefaultDashboard();
    }
  }, []);

  useEffect(() => {
    // Save dashboard configuration
    localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  const initializeDefaultDashboard = () => {
    const defaultWidgets: DashboardWidget[] = [
      {
        id: 'default_threats',
        type: 'metric',
        title: 'Active Threats',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 150 },
        config: widgetTemplates[0].defaultConfig,
        data: [{ value: 12, label: 'Active Threats' }]
      },
      {
        id: 'default_endpoints',
        type: 'chart',
        title: 'Endpoint Status',
        position: { x: 320, y: 0 },
        size: { width: 400, height: 300 },
        config: widgetTemplates[1].defaultConfig,
        data: [
          { name: 'Protected', value: 1198, color: '#22c55e' },
          { name: 'Unprotected', value: 49, color: '#ef4444' },
          { name: 'Offline', value: 23, color: '#6b7280' }
        ]
      },
      {
        id: 'default_trends',
        type: 'chart',
        title: 'Threat Trends',
        position: { x: 0, y: 170 },
        size: { width: 720, height: 300 },
        config: widgetTemplates[2].defaultConfig,
        data: generateTrendData()
      }
    ];

    setWidgets(defaultWidgets);
  };

  const generateTrendData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      detections: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 30) + 40,
      resolved: Math.floor(Math.random() * 20) + 35
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isEditMode) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const addWidget = (template: WidgetTemplate) => {
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      type: template.type,
      title: template.name,
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: { ...template.defaultConfig },
      data: generateMockData(template.defaultConfig.dataSource)
    };

    setWidgets([...widgets, newWidget]);
    setIsAddingWidget(false);
  };

  const generateMockData = (dataSource: string) => {
    switch (dataSource) {
      case 'threats':
        return [{ value: Math.floor(Math.random() * 50), label: 'Threats' }];
      case 'endpoints':
        return [
          { name: 'Protected', value: 1198, color: '#22c55e' },
          { name: 'Unprotected', value: 49, color: '#ef4444' }
        ];
      case 'detections':
        return Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          threat: ['Malware', 'Phishing', 'Suspicious Activity'][Math.floor(Math.random() * 3)],
          time: `${Math.floor(Math.random() * 60)} min ago`
        }));
      default:
        return [];
    }
  };

  const deleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const updateWidget = (updatedWidget: DashboardWidget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setEditingWidget(null);
  };

  const renderWidget = (widget: DashboardWidget) => {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">{widget.title}</CardTitle>
          {isEditMode && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingWidget(widget)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteWidget(widget.id)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {renderWidgetContent(widget)}
        </CardContent>
      </Card>
    );
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {widget.data?.[0]?.value || 0}
              </div>
              <p className="text-xs text-slate-400">{widget.data?.[0]?.label}</p>
            </div>
          </div>
        );

      case 'chart':
        if (widget.config.chartType === 'pie') {
          return (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={widget.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {widget.data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                  ))}
                </Pie>
                {widget.config.showLegend && <Tooltip />}
              </PieChart>
            </ResponsiveContainer>
          );
        } else if (widget.config.chartType === 'line') {
          return (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="detections" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          );
        }

      case 'list':
        return (
          <div className="space-y-2">
            {widget.data?.slice(0, widget.config.maxItems || 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-700/50">
                <span className="text-sm text-white">{item.threat}</span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        );

      case 'status':
        return (
          <div className="grid grid-cols-3 gap-2">
            {widget.config.metrics?.map((metric, index) => (
              <div key={metric} className="text-center p-2 rounded bg-slate-700/50">
                <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-1" />
                <span className="text-xs text-slate-300 capitalize">{metric}</span>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-slate-400">No content available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Custom Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            onClick={() => setIsEditMode(!isEditMode)}
            className={isEditMode ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditMode ? 'Exit Edit' : 'Edit Mode'}
          </Button>
          <Button
            onClick={() => setIsAddingWidget(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {isEditMode && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-sm text-slate-300 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Drag and drop widgets to rearrange them. Click edit to modify widget settings.
          </p>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!isEditMode}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={isEditMode ? 'cursor-move' : ''}
                    >
                      {renderWidget(widget)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Widget Dialog */}
      <Dialog open={isAddingWidget} onOpenChange={setIsAddingWidget}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Widget</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgetTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => addWidget(template)}
                  className="h-auto p-4 flex flex-col items-start border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 text-left">{template.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {template.type}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Widget Dialog */}
      <Dialog open={!!editingWidget} onOpenChange={() => setEditingWidget(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Widget</DialogTitle>
          </DialogHeader>
          {editingWidget && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Title</label>
                <Input
                  value={editingWidget.title}
                  onChange={(e) => setEditingWidget({
                    ...editingWidget,
                    title: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Refresh Interval (seconds)</label>
                <Input
                  type="number"
                  value={editingWidget.config.refreshInterval || 60}
                  onChange={(e) => setEditingWidget({
                    ...editingWidget,
                    config: {
                      ...editingWidget.config,
                      refreshInterval: parseInt(e.target.value)
                    }
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              {editingWidget.type === 'chart' && (
                <div>
                  <label className="text-sm font-medium text-slate-300">Chart Type</label>
                  <Select
                    value={editingWidget.config.chartType}
                    onValueChange={(value) => setEditingWidget({
                      ...editingWidget,
                      config: {
                        ...editingWidget.config,
                        chartType: value as any
                      }
                    })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingWidget(null)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateWidget(editingWidget)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardBuilder;
