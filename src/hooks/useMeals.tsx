
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Meal {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  meal_type: string;
  consumed_at: string;
  created_at: string;
}

interface CreateMealData {
  name: string;
  calories: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  sodium?: number;
  meal_type?: string;
  image_url?: string;
}

export const useMeals = (date?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data as Meal[];
    },
    enabled: !!user,
  });

  const { data: todayMeals = [] } = useQuery({
    queryKey: ['todayMeals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data as Meal[];
    },
    enabled: !!user,
  });

  const { data: dateMeals = [] } = useQuery({
    queryKey: ['dateMeals', user?.id, date],
    queryFn: async () => {
      if (!user || !date) return [];
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', `${date}T00:00:00`)
        .lt('consumed_at', `${date}T23:59:59`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data as Meal[];
    },
    enabled: !!user && !!date,
  });

  const createMealMutation = useMutation({
    mutationFn: async (mealData: CreateMealData) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('meals')
        .insert({
          ...mealData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newMeal) => {
      // Invalidar apenas as queries necessárias de forma mais específica
      queryClient.invalidateQueries({ queryKey: ['meals', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress', user?.id] });
      
      // Se estamos trabalhando com uma data específica, invalidar também
      if (date) {
        queryClient.invalidateQueries({ queryKey: ['dateMeals', user?.id, date] });
      }
      
      toast({
        title: 'Sucesso!',
        description: 'Refeição adicionada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao adicionar refeição',
        variant: 'destructive'
      });
    },
  });

  const uploadMealImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('No user logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('meal-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('meal-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  return {
    meals,
    todayMeals,
    dateMeals,
    isLoading,
    createMeal: createMealMutation.mutate,
    isCreating: createMealMutation.isPending,
    uploadMealImage,
  };
};
