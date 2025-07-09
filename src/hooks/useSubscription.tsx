
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

  // Use Payment Links instead of checkout sessions
  const openPaymentLink = (planType: 'monthly' | 'annual') => {
    const links = {
      monthly: 'https://buy.stripe.com/3cI6oG0t3ee73yOdYbgbm06',
      annual: 'https://buy.stripe.com/4gM6oGa3Dgmf5GW9HVgbm07'
    };
    
    // Open payment link in new tab
    window.open(links[planType], '_blank');
  };

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
    openPaymentLink,
    refreshSubscription,
  };
};
