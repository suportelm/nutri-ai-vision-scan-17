
import { useState } from 'react';
import { Camera, Scan, BarChart, User, Home, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CalorieProgress from '@/components/CalorieProgress';
import MealCard from '@/components/MealCard';
import ScanMeal from '@/components/ScanMeal';
import MacroStats from '@/components/MacroStats';
import QuickActions from '@/components/QuickActions';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanner, setShowScanner] = useState(false);

  const todayMeals = [
    {
      id: '1',
      name: 'Breakfast',
      time: '08:30',
      calories: 320,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    },
    {
      id: '2',
      name: 'Lunch',
      time: '12:45',
      calories: 680,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    }
  ];

  if (showScanner) {
    return <ScanMeal onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <h1 className="font-semibold text-lg">My NutriAI</h1>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-400">
          Edit
        </Button>
      </div>

      {/* Today Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today</h2>
          <span className="text-sm text-slate-400">Goal • Food • Exercise</span>
        </div>

        {/* Calorie Progress */}
        <CalorieProgress 
          current={1450} 
          goal={2200} 
          remaining={750}
        />
      </div>

      {/* Macro Stats */}
      <div className="px-6 mb-6">
        <MacroStats 
          water={1.2}
          exercise={45}
          food={3}
        />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <QuickActions onScanMeal={() => setShowScanner(true)} />
      </div>

      {/* Today's Meals */}
      <div className="px-6 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Today's Meals</h3>
          <Button variant="ghost" size="sm" className="text-blue-400">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {todayMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        {/* Add Meal Button */}
        <Button 
          onClick={() => setShowScanner(true)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
        >
          <Plus size={20} className="mr-2" />
          Log New Meal
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
