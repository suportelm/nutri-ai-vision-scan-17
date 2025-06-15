
import CalorieProgress from '@/components/CalorieProgress';
import MacroStats from '@/components/MacroStats';
import QuickActions from '@/components/QuickActions';

interface TodaySectionProps {
  totalCalories: number;
  dailyGoal: number;
  waterIntake: number;
  exerciseMinutes: number;
  mealsCount: number;
  onScanMeal: () => void;
}

const TodaySection = ({ 
  totalCalories, 
  dailyGoal, 
  waterIntake, 
  exerciseMinutes, 
  mealsCount, 
  onScanMeal 
}: TodaySectionProps) => {
  return (
    <>
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
            goal={dailyGoal} 
            remaining={dailyGoal - totalCalories}
          />
        </div>
      </div>

      {/* Macro Stats */}
      <div className="px-6 mb-6 animate-slide-up">
        <MacroStats 
          water={waterIntake}
          exercise={exerciseMinutes}
          food={mealsCount}
        />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6 animate-slide-up">
        <QuickActions onScanMeal={onScanMeal} />
      </div>
    </>
  );
};

export default TodaySection;
