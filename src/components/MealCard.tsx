
import { Card } from '@/components/ui/card';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  image: string;
}

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700">
          <img 
            src={meal.image} 
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{meal.name}</h3>
            <span className="text-sm text-slate-400">{meal.time}</span>
          </div>
          <p className="text-sm text-slate-400">{meal.calories} calories</p>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
