
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
  const dateString = selectedDate.toISOString().split('T')[0];
  const { progress } = useDailyProgress(dateString);
  
  // Para demonstração, vamos usar dados mockados por enquanto
  // TODO: Integrar com dados reais baseados na data selecionada
  const mockMeals = [
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
      name: 'Almoço - Salmão Grelhado com Arroz',
      time: '12:45',
      calories: 680,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: { protein: 35, carbs: 25, fat: 22, fiber: 4 }
    },
    {
      id: '3',
      name: 'Jantar - Salada Caesar com Frango',
      time: '19:20',
      calories: 420,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png',
      nutrition: { protein: 18, carbs: 15, fat: 28, fiber: 8 }
    }
  ];

  const totalCalories = progress?.total_calories || mockMeals.reduce((sum, meal) => sum + meal.calories, 0);
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
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
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDate('next')}
            className="p-2"
            disabled={selectedDate >= new Date()}
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
        </Card>

        {/* Meals by time periods */}
        <div className="space-y-6">
          {/* Breakfast */}
          <MealSection
            title="Café da Manhã"
            meals={mockMeals.filter(meal => meal.time < '12:00')}
            timeRange="06:00 - 11:59"
          />

          {/* Lunch */}
          <MealSection
            title="Almoço"
            meals={mockMeals.filter(meal => meal.time >= '12:00' && meal.time < '18:00')}
            timeRange="12:00 - 17:59"
          />

          {/* Dinner */}
          <MealSection
            title="Jantar"
            meals={mockMeals.filter(meal => meal.time >= '18:00')}
            timeRange="18:00 - 23:59"
          />

          {/* Snacks */}
          <MealSection
            title="Lanches"
            meals={[]}
            timeRange="Qualquer horário"
            isEmpty={true}
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
  isEmpty = false 
}: { 
  title: string; 
  meals: any[]; 
  timeRange: string;
  isEmpty?: boolean;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{timeRange}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus size={16} />
          Adicionar
        </Button>
      </div>
      
      <div className="space-y-3">
        {meals.length > 0 ? (
          meals.map(meal => <MealCard key={meal.id} meal={meal} />)
        ) : (
          <Card className="border-dashed border-2 border-muted p-6 text-center">
            <p className="text-muted-foreground">
              {isEmpty ? 'Nenhum lanche registrado hoje' : `Nenhum ${title.toLowerCase()} registrado`}
            </p>
            <Button variant="ghost" size="sm" className="mt-2 text-primary">
              Escanear Refeição
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Diary;
