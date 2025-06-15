
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  activity_level: string;
  goal: string;
  daily_calorie_goal: number;
  protein_goal: number | null;
  carb_goal: number | null;
  fat_goal: number | null;
  daily_water_goal: number | null;
  daily_exercise_goal: number | null;
  weekly_weight_goal: number | null;
  target_weight: number | null;
  main_objective: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      console.log('Profile data fetched:', data);
      return data as Profile;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('No user logged in');

      console.log('Updating profile with data:', updates);

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: 'Sucesso!',
        description: 'Perfil atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      console.error('Update profile error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar perfil',
        variant: 'destructive'
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
