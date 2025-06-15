
import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useMeals } from '@/hooks/useMeals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { Flame, Target, Activity, Zap } from 'lucide-react';

export const useStatsData = (timeframe: 'week' | 'month' | 'year') => {
  const { profile } = useProfile();
  const { meals } = useMeals();
  const { weeklyProgress, periodProgress } = useDailyProgress(undefined, timeframe);

  const currentProgress = timeframe === 'week' ? weeklyProgress : periodProgress;

  const stats = useMemo(() => {
    const totalMealsLogged = meals.length;
    const currentWeight = profile?.weight || 0;
    const targetWeight = profile?.target_weight || 0;
    const weightChange = targetWeight - currentWeight;

    const avgCalories = currentProgress.length > 0 
      ? Math.round(currentProgress.reduce((sum, day) => sum + day.total_calories, 0) / currentProgress.length)
      : 0;

    const periodStreak = currentProgress.filter(day => day.total_calories > 0).length;

    const perfectDays = currentProgress.filter(day => 
      day.total_calories >= (profile?.daily_calorie_goal || 2000) * 0.9 &&
      day.total_calories <= (profile?.daily_calorie_goal || 2000) * 1.1
    ).length;

    return {
      currentWeight,
      weightChange,
      avgCalories,
      periodStreak,
      mealsLogged: totalMealsLogged,
      perfectDays
    };
  }, [currentProgress, meals, profile]);

  const weightData = useMemo(() => [
    { date: '01/12', weight: stats.currentWeight + 2 },
    { date: '08/12', weight: stats.currentWeight + 1.5 },
    { date: '15/12', weight: stats.currentWeight + 1 },
    { date: '22/12', weight: stats.currentWeight + 0.5 },
    { date: '29/12', weight: stats.currentWeight + 0.2 },
    { date: '05/01', weight: stats.currentWeight },
    { date: '12/01', weight: stats.currentWeight }
  ], [stats.currentWeight]);

  const caloriesData = useMemo(() => {
    if (timeframe === 'week') {
      return currentProgress.map((day, index) => ({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index] || 'Dia',
        consumed: day.total_calories,
        goal: profile?.daily_calorie_goal || 2000
      }));
    } else if (timeframe === 'month') {
      const weeks = [];
      for (let i = 0; i < currentProgress.length; i += 7) {
        const weekData = currentProgress.slice(i, i + 7);
        const avgWeek = weekData.reduce((sum, day) => sum + day.total_calories, 0) / weekData.length;
        weeks.push({
          day: `Sem ${Math.floor(i / 7) + 1}`,
          consumed: Math.round(avgWeek),
          goal: profile?.daily_calorie_goal || 2000
        });
      }
      return weeks;
    } else {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months.map((month) => ({
        day: month,
        consumed: stats.avgCalories + Math.random() * 400 - 200,
        goal: profile?.daily_calorie_goal || 2000
      }));
    }
  }, [currentProgress, timeframe, profile, stats.avgCalories]);

  const macrosData = useMemo(() => {
    const recentMeals = meals.slice(0, 10);
    const totalProteins = recentMeals.reduce((sum, meal) => sum + (meal.proteins || 0), 0);
    const totalCarbs = recentMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFats = recentMeals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
    const totalMacros = totalProteins + totalCarbs + totalFats;

    return totalMacros > 0 ? [
      { name: 'Proteínas', value: Math.round((totalProteins / totalMacros) * 100), color: '#3b82f6' },
      { name: 'Carboidratos', value: Math.round((totalCarbs / totalMacros) * 100), color: '#f97316' },
      { name: 'Gorduras', value: Math.round((totalFats / totalMacros) * 100), color: '#eab308' }
    ] : [
      { name: 'Proteínas', value: 25, color: '#3b82f6' },
      { name: 'Carboidratos', value: 45, color: '#f97316' },
      { name: 'Gorduras', value: 30, color: '#eab308' }
    ];
  }, [meals]);

  const achievements = useMemo(() => [
    { 
      id: 1, 
      title: `${timeframe === 'week' ? '7' : timeframe === 'month' ? '30' : '365'} Dias Consecutivos`, 
      description: `Registrou refeições por ${timeframe === 'week' ? 'uma semana' : timeframe === 'month' ? 'um mês' : 'um ano'}`,
      icon: Flame,
      earned: stats.periodStreak >= (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365),
      date: stats.periodStreak >= (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365) ? '15/01/2024' : undefined
    },
    { 
      id: 2, 
      title: 'Meta de Proteína', 
      description: 'Atingiu meta de proteína 5 dias seguidos',
      icon: Target,
      earned: false,
      date: undefined
    },
    { 
      id: 3, 
      title: 'Scanner Expert', 
      description: 'Escaneou 50 refeições com IA',
      icon: Zap,
      earned: stats.mealsLogged >= 50,
      progress: Math.min(stats.mealsLogged, 50)
    },
    { 
      id: 4, 
      title: 'Mestre da Consistência', 
      description: `Registre refeições por ${timeframe === 'week' ? '7' : '30'} dias`,
      icon: Activity,
      earned: false,
      progress: stats.periodStreak
    }
  ], [stats, timeframe]);

  return {
    stats,
    weightData,
    caloriesData,
    macrosData,
    achievements
  };
};
