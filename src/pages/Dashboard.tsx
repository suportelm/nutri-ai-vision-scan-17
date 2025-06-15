
import { useState } from 'react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TodaySection from '@/components/Dashboard/TodaySection';
import QuickActions from '@/components/QuickActions';
import TodayMeals from '@/components/Dashboard/TodayMeals';
import CalorieProgress from '@/components/CalorieProgress';
import MacroStats from '@/components/MacroStats';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { progress } = useDailyProgress();
  const { todayMeals } = useMeals();
  const { profile } = useProfile();

  // Calculate values with defaults
  const totalCalories = progress?.total_calories || 0;
  const dailyGoal = profile?.daily_calorie_goal || 2000;
  const waterIntake = progress?.water_intake || 0;
  const exerciseMinutes = progress?.exercise_minutes || 0;
  const mealsCount = todayMeals?.length || 0;
  const remaining = Math.max(0, dailyGoal - totalCalories);

  const handleScanMeal = () => {
    console.log('Scanning meal...');
    // This will be implemented when the scan functionality is added
  };

  const handleViewAllMeals = () => {
    onNavigate('diary');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <DashboardHeader />
      
      <div className="px-6 space-y-6">
        <TodaySection 
          totalCalories={totalCalories}
          dailyGoal={dailyGoal}
          waterIntake={waterIntake}
          exerciseMinutes={exerciseMinutes}
          mealsCount={mealsCount}
          onScanMeal={handleScanMeal}
        />
        
        <CalorieProgress 
          current={totalCalories}
          goal={dailyGoal}
          remaining={remaining}
        />
        
        <MacroStats 
          water={waterIntake}
          exercise={exerciseMinutes}
          food={mealsCount}
        />
        
        <QuickActions onScanMeal={handleScanMeal} />
        
        <TodayMeals 
          meals={todayMeals || []}
          onScanMeal={handleScanMeal}
          onViewAll={handleViewAllMeals}
          isOnline={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
