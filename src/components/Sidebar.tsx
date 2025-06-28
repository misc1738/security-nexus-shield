import React from 'react';
import { Shield, Activity, Monitor, FileText, Settings, BarChart3, Users, AlertTriangle, TrendingUp, Brain, Layout, Target, Bug, Globe, FileCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationCenter from './NotificationCenter';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'detections', label: 'Detections', icon: AlertTriangle },
    { id: 'computers', label: 'Computers', icon: Monitor },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain },
    { id: 'dashboard-builder', label: 'Dashboard Builder', icon: Layout },
    { id: 'incident-response', label: 'Incident Response', icon: Zap },
    { id: 'vulnerability-management', label: 'Vulnerabilities', icon: Bug },
    { id: 'threat-hunting', label: 'Threat Hunting', icon: Target },
    { id: 'network-security', label: 'Network Security', icon: Globe },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'tasks', label: 'Tasks', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 min-h-screen">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sentinel</h1>
              <p className="text-xs text-slate-400">Security Platform</p>
            </div>
          </div>
          <NotificationCenter />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-300">AI Engine Online</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">ML models active</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;