import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import DetectionsPage from '@/components/DetectionsPage';
import ComputersPage from '@/components/ComputersPage';
import ThreatAnalytics from '@/components/ThreatAnalytics';
import AIAnalyticsPage from '@/components/AIAnalyticsPage';
import DashboardBuilder from '@/components/DashboardBuilder';
import IncidentResponsePage from '@/components/IncidentResponsePage';
import ComplianceAuditPage from '@/components/ComplianceAuditPage';
import VulnerabilityManagementPage from '@/components/VulnerabilityManagementPage';
import ThreatHuntingPage from '@/components/ThreatHuntingPage';
import NetworkSecurityPage from '@/components/NetworkSecurityPage';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import UserManagementPage from '@/components/UserManagementPage';
import AdvancedReportsPage from '@/components/AdvancedReportsPage';
import SystemSettingsPage from '@/components/SystemSettingsPage';
import PlaceholderPage from '@/components/PlaceholderPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'executive-dashboard':
        return <ExecutiveDashboard />;
      case 'detections':
        return <DetectionsPage />;
      case 'computers':
        return <ComputersPage />;
      case 'analytics':
        return <ThreatAnalytics />;
      case 'ai-analytics':
        return <AIAnalyticsPage />;
      case 'dashboard-builder':
        return <DashboardBuilder />;
      case 'incident-response':
        return <IncidentResponsePage />;
      case 'compliance':
        return <ComplianceAuditPage />;
      case 'vulnerability-management':
        return <VulnerabilityManagementPage />;
      case 'threat-hunting':
        return <ThreatHuntingPage />;
      case 'network-security':
        return <NetworkSecurityPage />;
      case 'users':
        return <UserManagementPage />;
      case 'reports':
        return <AdvancedReportsPage />;
      case 'settings':
        return <SystemSettingsPage />;
      case 'policies':
        return <PlaceholderPage title="Security Policies" description="Manage security policies and configurations" />;
      case 'tasks':
        return <PlaceholderPage title="Automated Tasks" description="Schedule and monitor endpoint tasks" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;