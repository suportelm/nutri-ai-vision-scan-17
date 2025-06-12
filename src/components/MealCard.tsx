
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  image: string;
  nutrition?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  return (
    <Card className="bg-gradient-card border-border/50 p-4 hover:border-primary/30 transition-all duration-200 group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/20 relative">
          <img 
            src={meal.image} 
            alt={meal.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground truncate pr-2">
              {meal.name}
            </h3>
            <Badge variant="secondary" className="bg-primary/20 text-primary shrink-0">
              {meal.calories} cal
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={12} />
              <span className="text-xs">{meal.time}</span>
            </div>
            {meal.nutrition && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap size={12} />
                <span className="text-xs">
                  P: {meal.nutrition.protein}g • C: {meal.nutrition.carbs}g • G: {meal.nutrition.fat}g
                </span>
              </div>
            )}
          </div>
          
          {meal.nutrition && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="text-center">
                <div className="text-xs font-medium text-primary">{meal.nutrition.protein}g</div>
                <div className="text-xs text-muted-foreground">Prot</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-secondary">{meal.nutrition.carbs}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-accent">{meal.nutrition.fat}g</div>
                <div className="text-xs text-muted-foreground">Gord</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground">{meal.nutrition.fiber}g</div>
                <div className="text-xs text-muted-foreground">Fibra</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
