
import { useState, useEffect } from 'react';
import { Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalorieProgress from '@/components/CalorieProgress';
import MealCard from '@/components/MealCard';
import ScanMeal from '@/components/ScanMeal';
import MacroStats from '@/components/MacroStats';
import QuickActions from '@/components/QuickActions';
import BottomNav from '@/components/BottomNav';
import Auth from '@/components/Auth';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Diary from './Diary';
import Plans from './Plans';
import Stats from './Stats';
import Profile from './Profile';
import { usePWA } from '@/hooks/usePWA';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { updateInfo, isOnline, updateApp } = usePWA();
  
  const [meals, setMeals] = useState([
    {
      id: '1',
      name: 'Café da Manhã - Aveia com Frutas',
      time: '08:30',
      calories: 320,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    },
    {
      id: '2',
      name: 'Almoço - Salmão Grelhado',
      time: '12:45',
      calories: 680,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    }
  ]);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('user_authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleMealAdded = (newMeal: any) => {
    setMeals(prev => [...prev, newMeal]);
  };

  const handleScanMeal = () => {
    setShowScanner(true);
  };

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

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
      <div className="no-scroll-x">
        <Diary />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="no-scroll-x">
        <Stats />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="no-scroll-x">
        <Profile />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PWAInstallPrompt />
      </div>
    );
  }

  // Dashboard/Home view
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const userName = localStorage.getItem('user_name') || 'Usuário';

  return (
    <div className="min-h-screen bg-background text-foreground no-scroll-x">
      {/* Update notification */}
      {updateInfo.updateAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 text-center">
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
      <div className="relative pwa-safe-area">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="relative flex items-center justify-between p-6 pt-12">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-nutriai rounded-full flex items-center justify-center shadow-xl">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-heading">NutriAI Vision</h1>
              <div className="flex items-center gap-2">
                <p className="text-caption">Olá, {userName}!</p>
                {!isOnline && (
                  <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </Button>
        </div>
      </div>

      {/* Today Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4 animate-slide-up">
          <h2 className="text-subheading">Hoje</h2>
          <span className="text-caption">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>

        {/* Calorie Progress */}
        <div className="animate-fade-in">
          <CalorieProgress 
            current={totalCalories} 
            goal={2200} 
            remaining={2200 - totalCalories}
          />
        </div>
      </div>

      {/* Macro Stats */}
      <div className="px-6 mb-6 animate-slide-up">
        <MacroStats 
          water={1.2}
          exercise={45}
          food={meals.length}
        />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6 animate-slide-up">
        <QuickActions onScanMeal={handleScanMeal} />
      </div>

      {/* Today's Meals */}
      <div className="px-6 mb-20 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-subheading">Refeições de Hoje</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
            onClick={() => setActiveTab('diary')}
          >
            Ver Todas
          </Button>
        </div>
        
        <div className="space-y-3">
          {meals.map((meal, index) => (
            <div key={meal.id} className="animate-scale-in card-interactive" style={{animationDelay: `${index * 0.1}s`}}>
              <MealCard meal={meal} />
            </div>
          ))}
        </div>

        {/* Add Meal Button */}
        <Button 
          onClick={handleScanMeal}
          className="w-full mt-6 btn-primary text-white py-4 text-lg"
          size="lg"
          disabled={!isOnline}
        >
          <Plus size={24} className="mr-3" />
          {isOnline ? 'Escanear Nova Refeição' : 'Funcionalidade Offline'}
        </Button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="outline" 
            className="btn-secondary"
            onClick={() => setActiveTab('stats')}
          >
            Ver Estatísticas
          </Button>
          <Button 
            variant="outline" 
            className="btn-secondary"
            onClick={() => setActiveTab('plans')}
          >
            Planos Alimentares
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
