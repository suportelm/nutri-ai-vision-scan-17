
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ScanMeal from '@/components/ScanMeal';
import BottomNav from '@/components/BottomNav';
import Auth from '@/components/Auth';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Diary from './Diary';
import Plans from './Plans';
import Stats from './Stats';
import Profile from './Profile';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TodaySection from '@/components/Dashboard/TodaySection';
import TodayMeals from '@/components/Dashboard/TodayMeals';
import { usePWA } from '@/hooks/usePWA';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMeals } from '@/hooks/useMeals';
import { useDailyProgress } from '@/hooks/useDailyProgress';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { todayMeals, createMeal } = useMeals();
  const { progress } = useDailyProgress();
  const { updateInfo, isOnline, updateApp } = usePWA();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="pwa-container mobile-optimized flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Show authentication screen if not logged in
  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  const handleMealAdded = (newMeal: any) => {
    createMeal(newMeal);
  };

  const handleScanMeal = () => {
    setShowScanner(true);
  };

  if (showScanner) {
    return (
      <ScanMeal 
        onClose={() => setShowScanner(false)} 
        onMealAdded={handleMealAdded}
      />
    );
  }

  // Render different pages based on active tab
  if (activeTab === 'diary') {
    return (
      <div className="pwa-container no-scroll-x">
        <Diary />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="pwa-container no-scroll-x">
        <Stats />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="pwa-container no-scroll-x">
        <Profile />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  // Dashboard/Home view
  const totalCalories = progress?.total_calories || 0;
  const dailyGoal = profile?.daily_calorie_goal || 2000;
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuário';

  return (
    <div className="pwa-container mobile-optimized bg-background text-foreground no-scroll-x">
      {/* Update notification */}
      {updateInfo.updateAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 text-center pt-safe">
          <p className="text-sm">Nova versão disponível!</p>
          <Button 
            onClick={updateApp} 
            size="sm" 
            variant="secondary" 
            className="mt-1"
          >
            Atualizar
          </Button>
        </div>
      )}

      {/* Header */}
      <DashboardHeader 
        userName={userName}
        isOnline={isOnline}
        onProfileClick={() => setActiveTab('profile')}
      />

      {/* Today Section */}
      <TodaySection 
        totalCalories={totalCalories}
        dailyGoal={dailyGoal}
        waterIntake={progress?.water_intake || 0}
        exerciseMinutes={progress?.exercise_minutes || 0}
        mealsCount={todayMeals.length}
        onScanMeal={handleScanMeal}
      />

      {/* Today's Meals */}
      <TodayMeals 
        meals={todayMeals}
        onScanMeal={handleScanMeal}
        onViewAll={() => setActiveTab('diary')}
        isOnline={isOnline}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
