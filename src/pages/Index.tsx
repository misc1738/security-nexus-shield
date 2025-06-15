
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import DetectionsPage from '@/components/DetectionsPage';
import ComputersPage from '@/components/ComputersPage';
import ThreatAnalytics from '@/components/ThreatAnalytics';
import PlaceholderPage from '@/components/PlaceholderPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'detections':
        return <DetectionsPage />;
      case 'computers':
        return <ComputersPage />;
      case 'analytics':
        return <ThreatAnalytics />;
      case 'policies':
        return <PlaceholderPage title="Policies" description="Manage security policies and configurations" />;
      case 'tasks':
        return <PlaceholderPage title="Tasks" description="Schedule and monitor endpoint tasks" />;
      case 'reports':
        return <PlaceholderPage title="Reports" description="Generate comprehensive security reports" />;
      case 'users':
        return <PlaceholderPage title="User Management" description="Manage user accounts and permissions" />;
      case 'settings':
        return <PlaceholderPage title="Settings" description="Configure system settings and preferences" />;
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
