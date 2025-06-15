import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MealCard from '@/components/MealCard';
import { useMeals } from '@/hooks/useMeals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { useProfile } from '@/hooks/useProfile';

const Diary = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { profile } = useProfile();
  const { dateMeals } = useMeals(selectedDate.toISOString().split('T')[0]);
  const dateString = selectedDate.toISOString().split('T')[0];
  const { progress } = useDailyProgress(dateString);

  // Classificar refeições por período do dia
  const getMealsByPeriod = (startHour: number, endHour: number) => {
    return dateMeals.filter(meal => {
      const mealHour = new Date(meal.consumed_at).getHours();
      if (startHour <= endHour) {
        return mealHour >= startHour && mealHour < endHour;
      } else {
        return mealHour >= startHour || mealHour < endHour;
      }
    }).map(meal => ({
      id: meal.id,
      name: meal.name,
      time: format(new Date(meal.consumed_at), 'HH:mm'),
      calories: meal.calories,
      image: meal.image_url || '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: {
        protein: meal.proteins || 0,
        carbs: meal.carbs || 0,
        fat: meal.fats || 0,
        fiber: meal.fiber || 0
      }
    }));
  };

  const breakfastMeals = getMealsByPeriod(6, 12);
  const lunchMeals = getMealsByPeriod(12, 18);
  const dinnerMeals = getMealsByPeriod(18, 24);
  const snackMeals = dateMeals.filter(meal => {
    const mealHour = new Date(meal.consumed_at).getHours();
    return (mealHour >= 0 && mealHour < 6) || 
           (mealHour >= 9 && mealHour < 12) || 
           (mealHour >= 15 && mealHour < 18) || 
           (mealHour >= 21 && mealHour < 24);
  }).map(meal => ({
    id: meal.id,
    name: meal.name,
    time: format(new Date(meal.consumed_at), 'HH:mm'),
    calories: meal.calories,
    image: meal.image_url || '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
    nutrition: {
      protein: meal.proteins || 0,
      carbs: meal.carbs || 0,
      fat: meal.fats || 0,
      fiber: meal.fiber || 0
    }
  }));

  const totalCalories = progress?.total_calories || dateMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const goalCalories = profile?.daily_calorie_goal || 2200;
  const remaining = goalCalories - totalCalories;

  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-safe">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/50 p-6 pt-12 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Diário Alimentar</h1>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon size={16} />
                Calendário
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDate('prev')}
            className="p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div className="text-center">
            <div className="text-lg font-medium">
              {formatDate(selectedDate)}
            </div>
            {isToday && (
              <div className="text-sm text-primary font-medium">Hoje</div>
            )}
            {isFuture && (
              <div className="text-sm text-muted-foreground">Futuro</div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDate('next')}
            className="p-2"
            disabled={isFuture}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Daily Summary Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Resumo do Dia</h3>
            <div className="flex items-center gap-2">
              {remaining > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {remaining > 0 ? `${remaining} kcal restantes` : `${Math.abs(remaining)} kcal acima`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCalories}</div>
              <div className="text-sm text-muted-foreground">Consumidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{goalCalories}</div>
              <div className="text-sm text-muted-foreground">Meta</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(remaining)}
              </div>
              <div className="text-sm text-muted-foreground">
                {remaining > 0 ? 'Restantes' : 'Excesso'}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                totalCalories <= goalCalories 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
              style={{ width: `${Math.min((totalCalories / goalCalories) * 100, 100)}%` }}
            />
          </div>

          {/* Nutrition Summary */}
          {progress && (
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{Math.round(progress.total_proteins)}g</div>
                <div className="text-xs text-muted-foreground">Proteínas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-secondary">{Math.round(progress.total_carbs)}g</div>
                <div className="text-xs text-muted-foreground">Carboidratos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">{Math.round(progress.total_fats)}g</div>
                <div className="text-xs text-muted-foreground">Gorduras</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-muted-foreground">{Math.round(progress.total_fiber)}g</div>
                <div className="text-xs text-muted-foreground">Fibras</div>
              </div>
            </div>
          )}
        </Card>

        {/* Meals by time periods */}
        <div className="space-y-6">
          {/* Breakfast */}
          <MealSection
            title="Café da Manhã"
            meals={breakfastMeals}
            timeRange="06:00 - 11:59"
            selectedDate={selectedDate}
          />

          {/* Lunch */}
          <MealSection
            title="Almoço"
            meals={lunchMeals}
            timeRange="12:00 - 17:59"
            selectedDate={selectedDate}
          />

          {/* Dinner */}
          <MealSection
            title="Jantar"
            meals={dinnerMeals}
            timeRange="18:00 - 23:59"
            selectedDate={selectedDate}
          />

          {/* Snacks */}
          <MealSection
            title="Lanches"
            meals={snackMeals}
            timeRange="Qualquer horário"
            selectedDate={selectedDate}
            isSnacks={true}
          />
        </div>
      </div>
    </div>
  );
};

// Componente para seções de refeições
const MealSection = ({ 
  title, 
  meals, 
  timeRange, 
  selectedDate,
  isSnacks = false 
}: { 
  title: string; 
  meals: any[]; 
  timeRange: string;
  selectedDate: Date;
  isSnacks?: boolean;
}) => {
  const isFuture = selectedDate > new Date();
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{timeRange}</p>
        </div>
        {(isToday || !isFuture) && (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus size={16} />
            Adicionar
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {meals.length > 0 ? (
          meals.map(meal => <MealCard key={meal.id} meal={meal} />)
        ) : (
          <Card className="border-dashed border-2 border-muted p-6 text-center">
            <p className="text-muted-foreground">
              {isFuture 
                ? `Nenhum ${title.toLowerCase()} planejado` 
                : isSnacks 
                  ? 'Nenhum lanche registrado neste dia' 
                  : `Nenhum ${title.toLowerCase()} registrado neste dia`
              }
            </p>
            {(isToday || !isFuture) && (
              <Button variant="ghost" size="sm" className="mt-2 text-primary">
                Adicionar Refeição
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Diary;
