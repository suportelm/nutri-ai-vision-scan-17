
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MealCard from '@/components/MealCard';
interface Meal {
  id: string;
  name: string;
  consumed_at: string;
  calories: number;
  image_url?: string;
}
interface TodayMealsProps {
  meals: Meal[];
  onScanMeal: () => void;
  onViewAll: () => void;
  onViewStats: () => void;
  isOnline: boolean;
}
const TodayMeals = ({
  meals,
  onScanMeal,
  onViewAll,
  onViewStats,
  isOnline
}: TodayMealsProps) => {
  return <div className="px-6 mb-20 animate-slide-up my-0 py-[20px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-subheading">Refeições de Hoje</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200" onClick={onViewAll}>
          Ver Todas
        </Button>
      </div>
      
      <div className="space-y-3">
        {meals.map((meal, index) => <div key={meal.id} className="animate-scale-in card-interactive" style={{
        animationDelay: `${index * 0.1}s`
      }}>
            <MealCard meal={{
          id: meal.id,
          name: meal.name,
          time: new Date(meal.consumed_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          calories: meal.calories,
          image: meal.image_url || '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
        }} />
          </div>)}
        
        {meals.length === 0 && <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma refeição registrada hoje</p>
            <p className="text-sm">Escaneie uma refeição para começar!</p>
          </div>}
      </div>

      {/* Add Meal Button */}
      <Button onClick={onScanMeal} className="w-full mt-6 btn-primary text-white py-4 text-lg" size="lg" disabled={!isOnline}>
        <Plus size={24} className="mr-3" />
        {isOnline ? 'Escanear Nova Refeição' : 'Funcionalidade Offline'}
      </Button>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" className="btn-secondary" onClick={onViewStats}>
          Ver Estatísticas
        </Button>
        <Button variant="outline" className="btn-secondary" onClick={() => {}}>
          Planos Alimentares
        </Button>
      </div>
    </div>;
};
export default TodayMeals;
