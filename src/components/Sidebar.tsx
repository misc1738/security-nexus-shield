import React from 'react';
import { Shield, Activity, Monitor, FileText, Settings, BarChart3, Users, AlertTriangle, TrendingUp, Brain, Layout, Target, Bug, Globe, FileCheck, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationCenter from './NotificationCenter';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: BarChart3 },
    { id: 'executive-dashboard', label: 'Executive View', icon: Award },
    { id: 'detections', label: 'Detections', icon: AlertTriangle },
    { id: 'incident-response', label: 'Incident Response', icon: Zap },
    { id: 'computers', label: 'Endpoints', icon: Monitor },
    { id: 'vulnerability-management', label: 'Vulnerabilities', icon: Bug },
    { id: 'threat-hunting', label: 'Threat Hunting', icon: Target },
    { id: 'network-security', label: 'Network Security', icon: Globe },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain },
    { id: 'dashboard-builder', label: 'Dashboard Builder', icon: Layout },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Advanced Reports', icon: FileText },
    { id: 'policies', label: 'Security Policies', icon: Shield },
    { id: 'tasks', label: 'Automated Tasks', icon: Activity },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 min-h-screen">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sentinel</h1>
              <p className="text-xs text-slate-400">Enterprise Security Platform</p>
            </div>
          </div>
          <NotificationCenter />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-md"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  activeTab === item.id ? "scale-110" : "group-hover:scale-105"
                )} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">Security Status</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Threat Level</span>
              <span className="text-green-400">Low</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">AI Engine</span>
              <span className="text-blue-400">Active</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Compliance</span>
              <span className="text-green-400">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;