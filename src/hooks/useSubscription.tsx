
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        throw error;
      }
      
      return data as SubscriptionData;
    },
    enabled: !!user,
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Abrir checkout em nova aba
      window.open(data.url, '_blank');
    },
    onError: (error: any) => {
      console.error('Checkout error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar sessão de pagamento',
        variant: 'destructive'
      });
    },
  });

  const refreshSubscription = async () => {
    queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
  };

  const isPremium = subscription?.subscribed && 
    (subscription?.subscription_tier === 'premium' || subscription?.subscription_tier === 'premium_annual');

  return {
    subscription,
    isLoading,
    error,
    isPremium,
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    refreshSubscription,
  };
};
