
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DailyProgress {
  id: string;
  user_id: string;
  date: string;
  total_calories: number;
  total_proteins: number;
  total_carbs: number;
  total_fats: number;
  total_fiber: number;
  water_intake: number;
  exercise_minutes: number;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

export const useDailyProgress = (date?: string, period: 'week' | 'month' | 'year' = 'week') => {
  const { user } = useAuth();
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data: progress, isLoading } = useQuery({
    queryKey: ['dailyProgress', user?.id, targetDate],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (error) throw error;
      return data as DailyProgress | null;
    },
    enabled: !!user,
  });

  const { data: weeklyProgress = [] } = useQuery({
    queryKey: ['weeklyProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data as DailyProgress[];
    },
    enabled: !!user,
  });

  const { data: periodProgress = [] } = useQuery({
    queryKey: ['periodProgress', user?.id, period],
    queryFn: async () => {
      if (!user) return [];
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data as DailyProgress[];
    },
    enabled: !!user,
  });

  return {
    progress,
    weeklyProgress,
    periodProgress,
    isLoading,
  };
};
