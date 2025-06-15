
import { useState } from 'react';
import StatsHeader from '@/components/Stats/StatsHeader';
import PremiumBanner from '@/components/Stats/PremiumBanner';
import QuickStatsGrid from '@/components/Stats/QuickStatsGrid';
import WeightChart from '@/components/Stats/WeightChart';
import CaloriesChart from '@/components/Stats/CaloriesChart';
import MacrosChart from '@/components/Stats/MacrosChart';
import AchievementsSection from '@/components/Stats/AchievementsSection';
import ReportsModal from '@/components/Reports/ReportsModal';
import SubscriptionCard from '@/components/Subscription/SubscriptionCard';
import { useStatsData } from '@/hooks/useStatsData';

const Stats = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [showReports, setShowReports] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const { stats, weightData, caloriesData, macrosData, achievements } = useStatsData(timeframe);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Básico',
      price: 0,
      period: 'month' as const,
      features: [
        'Escaneamento básico de alimentos',
        'Estatísticas semanais',
        'Histórico de 7 dias',
        'Acompanhamento de calorias'
      ],
      limits: {
        scans: 5,
        history: '7 dias',
        reports: false,
        aiPlans: false
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.90,
      period: 'month' as const,
      popular: true,
      features: [
        'Escaneamento ilimitado',
        'Estatísticas avançadas',
        'Histórico completo',
        'Relatórios personalizados',
        'Planos alimentares com IA',
        'Análise nutricional detalhada'
      ],
      limits: {
        scans: 'unlimited' as const,
        history: 'Completo',
        reports: true,
        aiPlans: true
      }
    },
    {
      id: 'annual',
      name: 'Premium Anual',
      price: 199.00,
      originalPrice: 238.80,
      period: 'year' as const,
      features: [
        'Todos os recursos Premium',
        '2 meses grátis',
        'Suporte prioritário',
        'Beta features exclusivos'
      ],
      limits: {
        scans: 'unlimited' as const,
        history: 'Completo',
        reports: true,
        aiPlans: true
      }
    }
  ];

  const handleSelectPlan = (planId: string) => {
    console.log('Plano selecionado:', planId);
    // Aqui será integrado com Stripe
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <StatsHeader timeframe={timeframe} onTimeframeChange={setTimeframe} />

      <div className="px-6 space-y-6">
        <PremiumBanner 
          onShowReports={() => setShowReports(true)}
          onShowSubscription={() => setShowSubscription(true)}
        />

        <QuickStatsGrid stats={stats} timeframe={timeframe} />

        <WeightChart weightData={weightData} weightChange={stats.weightChange} />

        <CaloriesChart caloriesData={caloriesData} timeframe={timeframe} />

        <MacrosChart macrosData={macrosData} />

        <AchievementsSection achievements={achievements} timeframe={timeframe} />
      </div>

      <ReportsModal
        isOpen={showReports}
        onClose={() => setShowReports(false)}
        period={timeframe}
      />

      {showSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
                  <p className="text-muted-foreground">Desbloqueie todo o potencial do NutriAI</p>
                </div>
                <button 
                  className="text-muted-foreground hover:text-foreground text-2xl"
                  onClick={() => setShowSubscription(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    currentPlan="free"
                    onSelectPlan={handleSelectPlan}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
