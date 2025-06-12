
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import MealCard from '@/components/MealCard';

const Diary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([
    {
      id: '1',
      name: 'Café da Manhã - Aveia com Frutas',
      time: '08:30',
      calories: 320,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: { protein: 12, carbs: 45, fat: 8, fiber: 6 }
    },
    {
      id: '2',
      name: 'Almoço - Salmão Grelhado',
      time: '12:45',
      calories: 680,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: { protein: 35, carbs: 25, fat: 22, fiber: 4 }
    },
    {
      id: '3',
      name: 'Jantar - Salada Caesar',
      time: '19:20',
      calories: 420,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: { protein: 18, carbs: 15, fat: 28, fiber: 8 }
    }
  ]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const goalCalories = 2200;
  const remaining = goalCalories - totalCalories;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-heading">Diário Alimentar</h1>
          <Button variant="ghost" size="sm" className="text-primary">
            <Calendar size={20} />
          </Button>
        </div>
        
        <div className="text-body text-muted-foreground">
          {formatDate(selectedDate)}
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Daily Summary */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-subheading">Resumo do Dia</h3>
            <div className="flex items-center gap-2">
              {remaining > 0 ? (
                <TrendingUp className="w-4 h-4 text-secondary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${remaining > 0 ? 'text-secondary' : 'text-destructive'}`}>
                {remaining > 0 ? `${remaining} restantes` : `${Math.abs(remaining)} acima`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCalories}</div>
              <div className="text-caption">Consumidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{goalCalories}</div>
              <div className="text-caption">Meta</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${remaining > 0 ? 'text-secondary' : 'text-destructive'}`}>
                {Math.abs(remaining)}
              </div>
              <div className="text-caption">
                {remaining > 0 ? 'Restantes' : 'Excesso'}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="bg-gradient-nutriai h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalCalories / goalCalories) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Meals by time */}
        <div className="space-y-6">
          {/* Breakfast */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-subheading">Café da Manhã</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus size={16} />
              </Button>
            </div>
            {meals.filter(meal => meal.time < '12:00').map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* Lunch */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-subheading">Almoço</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus size={16} />
              </Button>
            </div>
            {meals.filter(meal => meal.time >= '12:00' && meal.time < '18:00').map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* Dinner */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-subheading">Jantar</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus size={16} />
              </Button>
            </div>
            {meals.filter(meal => meal.time >= '18:00').map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* Snacks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-subheading">Lanches</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus size={16} />
              </Button>
            </div>
            <Card className="bg-muted/10 border-dashed border-border/50 p-6 text-center">
              <p className="text-muted-foreground text-sm">Nenhum lanche registrado hoje</p>
            </Card>
          </div>
        </div>

        {/* Quick Add */}
        <Card className="bg-gradient-card border-border/50 p-4">
          <h3 className="text-subheading mb-3">Adicionar Rapidamente</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-border hover:bg-muted">
              <Plus size={16} className="mr-2" />
              Escanear Refeição
            </Button>
            <Button variant="outline" className="border-border hover:bg-muted">
              <Plus size={16} className="mr-2" />
              Buscar Alimento
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Diary;
