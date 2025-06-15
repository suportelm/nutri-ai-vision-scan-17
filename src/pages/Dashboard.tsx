
import { useState } from 'react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TodaySection from '@/components/Dashboard/TodaySection';
import QuickActions from '@/components/QuickActions';
import TodayMeals from '@/components/Dashboard/TodayMeals';
import CalorieProgress from '@/components/CalorieProgress';
import MacroStats from '@/components/MacroStats';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <DashboardHeader onNavigate={onNavigate} />
      
      <div className="px-6 space-y-6">
        <TodaySection />
        
        <CalorieProgress />
        
        <MacroStats />
        
        <QuickActions onNavigate={onNavigate} />
        
        <TodayMeals />
      </div>
    </div>
  );
};

export default Dashboard;
