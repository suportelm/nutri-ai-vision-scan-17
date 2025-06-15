
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/pages/Dashboard';
import Diary from '@/pages/Diary';
import Plans from '@/pages/Plans';
import Stats from '@/pages/Stats';
import Profile from '@/pages/Profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'diary':
        return <Diary />;
      case 'plans':
        return <Plans />;
      case 'stats':
        return <Stats />;
      case 'profile':
        return <Profile onNavigate={setActiveTab} />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
