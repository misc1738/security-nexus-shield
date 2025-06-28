import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Shield, Bell, Database, Network, Key, Save, RefreshCw } from 'lucide-react';

interface SystemSetting {
  id: string;
  category: 'security' | 'notifications' | 'database' | 'network' | 'authentication';
  name: string;
  description: string;
  type: 'boolean' | 'text' | 'number' | 'select' | 'password';
  value: any;
  options?: string[];
  required: boolean;
}

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([
    // Security Settings
    {
      id: 'auto_quarantine',
      category: 'security',
      name: 'Auto Quarantine Malware',
      description: 'Automatically quarantine detected malware files',
      type: 'boolean',
      value: true,
      required: false
    },
    {
      id: 'threat_intel_feeds',
      category: 'security',
      name: 'Threat Intelligence Feeds',
      description: 'Enable external threat intelligence feeds',
      type: 'boolean',
      value: true,
      required: false
    },
    {
      id: 'incident_retention',
      category: 'security',
      name: 'Incident Retention (days)',
      description: 'Number of days to retain incident data',
      type: 'number',
      value: 365,
      required: true
    },
    {
      id: 'risk_threshold',
      category: 'security',
      name: 'Risk Score Threshold',
      description: 'Minimum risk score for automatic alerts',
      type: 'select',
      value: 'medium',
      options: ['low', 'medium', 'high', 'critical'],
      required: true
    },

    // Notification Settings
    {
      id: 'email_notifications',
      category: 'notifications',
      name: 'Email Notifications',
      description: 'Enable email notifications for security events',
      type: 'boolean',
      value: true,
      required: false
    },
    {
      id: 'sms_notifications',
      category: 'notifications',
      name: 'SMS Notifications',
      description: 'Enable SMS notifications for critical alerts',
      type: 'boolean',
      value: false,
      required: false
    },
    {
      id: 'notification_frequency',
      category: 'notifications',
      name: 'Notification Frequency',
      description: 'How often to send digest notifications',
      type: 'select',
      value: 'daily',
      options: ['immediate', 'hourly', 'daily', 'weekly'],
      required: true
    },
    {
      id: 'alert_recipients',
      category: 'notifications',
      name: 'Alert Recipients',
      description: 'Email addresses for security alerts (comma-separated)',
      type: 'text',
      value: 'security-team@company.com, soc@company.com',
      required: true
    },

    // Database Settings
    {
      id: 'db_backup_enabled',
      category: 'database',
      name: 'Automatic Backups',
      description: 'Enable automatic database backups',
      type: 'boolean',
      value: true,
      required: false
    },
    {
      id: 'db_backup_frequency',
      category: 'database',
      name: 'Backup Frequency',
      description: 'How often to perform database backups',
      type: 'select',
      value: 'daily',
      options: ['hourly', 'daily', 'weekly'],
      required: true
    },
    {
      id: 'db_retention_period',
      category: 'database',
      name: 'Data Retention (days)',
      description: 'Number of days to retain log data',
      type: 'number',
      value: 90,
      required: true
    },

    // Network Settings
    {
      id: 'api_rate_limit',
      category: 'network',
      name: 'API Rate Limit',
      description: 'Maximum API requests per minute',
      type: 'number',
      value: 1000,
      required: true
    },
    {
      id: 'session_timeout',
      category: 'network',
      name: 'Session Timeout (minutes)',
      description: 'User session timeout duration',
      type: 'number',
      value: 30,
      required: true
    },
    {
      id: 'allowed_ips',
      category: 'network',
      name: 'Allowed IP Ranges',
      description: 'IP ranges allowed to access the system',
      type: 'text',
      value: '192.168.0.0/16, 10.0.0.0/8',
      required: false
    },

    // Authentication Settings
    {
      id: 'mfa_required',
      category: 'authentication',
      name: 'Require MFA',
      description: 'Require multi-factor authentication for all users',
      type: 'boolean',
      value: true,
      required: false
    },
    {
      id: 'password_complexity',
      category: 'authentication',
      name: 'Password Complexity',
      description: 'Minimum password complexity level',
      type: 'select',
      value: 'high',
      options: ['low', 'medium', 'high'],
      required: true
    },
    {
      id: 'password_expiry',
      category: 'authentication',
      name: 'Password Expiry (days)',
      description: 'Number of days before passwords expire',
      type: 'number',
      value: 90,
      required: true
    },
    {
      id: 'max_login_attempts',
      category: 'authentication',
      name: 'Max Login Attempts',
      description: 'Maximum failed login attempts before lockout',
      type: 'number',
      value: 5,
      required: true
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (id: string, value: any) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
    setHasChanges(true);
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // In a real implementation, this would save to the backend
  };

  const resetSettings = () => {
    console.log('Resetting settings to defaults');
    setHasChanges(false);
    // In a real implementation, this would reset to default values
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => updateSetting(setting.id, checked)}
          />
        );
      case 'select':
        return (
          <Select value={setting.value} onValueChange={(value) => updateSetting(setting.id, value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {setting.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
            className="bg-slate-700 border-slate-600 text-white"
          />
        );
      case 'password':
        return (
          <Input
            type="password"
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        );
      default:
        return setting.name.includes('Recipients') || setting.name.includes('IP') ? (
          <Textarea
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
            rows={3}
          />
        ) : (
          <Input
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-5 h-5" />;
      case 'notifications': return <Bell className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'network': return <Network className="w-5 h-5" />;
      case 'authentication': return <Key className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-400" />
            System Settings
          </h1>
          <p className="text-slate-400">Configure system behavior and security policies</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={resetSettings} className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Authentication
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white">{setting.name}</h4>
                        {setting.required && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500 text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{setting.description}</p>
                    </div>
                    <div className="w-64">
                      {renderSettingInput(setting)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SystemSettingsPage;