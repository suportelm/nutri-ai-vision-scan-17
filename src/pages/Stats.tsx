import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Award,
  Target,
  Activity,
  Zap,
  Flame,
  FileText,
  Crown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { useProfile } from '@/hooks/useProfile';
import { useMeals } from '@/hooks/useMeals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import ReportsModal from '@/components/Reports/ReportsModal';
import SubscriptionCard from '@/components/Subscription/SubscriptionCard';

const Stats = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [showReports, setShowReports] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const { profile } = useProfile();
  const { meals } = useMeals();
  const { weeklyProgress, periodProgress } = useDailyProgress(undefined, timeframe);

  // Usar os dados do período selecionado
  const currentProgress = timeframe === 'week' ? weeklyProgress : periodProgress;

  // Calcular estatísticas reais baseadas no período
  const totalMealsLogged = meals.length;
  const currentWeight = profile?.weight || 0;
  const targetWeight = profile?.target_weight || 0;
  const weightChange = targetWeight - currentWeight;

  // Calcular média de calorias do período atual
  const avgCalories = currentProgress.length > 0 
    ? Math.round(currentProgress.reduce((sum, day) => sum + day.total_calories, 0) / currentProgress.length)
    : 0;

  // Calcular sequência de dias do período atual
  const periodStreak = currentProgress.filter(day => day.total_calories > 0).length;

  // Dados do gráfico de peso (simulados baseados no perfil)
  const weightData = [
    { date: '01/12', weight: currentWeight + 2 },
    { date: '08/12', weight: currentWeight + 1.5 },
    { date: '15/12', weight: currentWeight + 1 },
    { date: '22/12', weight: currentWeight + 0.5 },
    { date: '29/12', weight: currentWeight + 0.2 },
    { date: '05/01', weight: currentWeight },
    { date: '12/01', weight: currentWeight }
  ];

  // Dados das calorias do período
  const getCaloriesData = () => {
    if (timeframe === 'week') {
      return currentProgress.map((day, index) => ({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index] || 'Dia',
        consumed: day.total_calories,
        goal: profile?.daily_calorie_goal || 2000
      }));
    } else if (timeframe === 'month') {
      // Agrupar por semanas do mês
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
      // Agrupar por meses do ano
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months.map((month, index) => ({
        day: month,
        consumed: avgCalories + Math.random() * 400 - 200, // Simulado para o ano
        goal: profile?.daily_calorie_goal || 2000
      }));
    }
  };

  const caloriesData = getCaloriesData();

  // Dados das calorias da semana
  const recentMeals = meals.slice(0, 10);
  const totalProteins = recentMeals.reduce((sum, meal) => sum + (meal.proteins || 0), 0);
  const totalCarbs = recentMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFats = recentMeals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  const totalMacros = totalProteins + totalCarbs + totalFats;

  const macrosData = totalMacros > 0 ? [
    { name: 'Proteínas', value: Math.round((totalProteins / totalMacros) * 100), color: '#3b82f6' },
    { name: 'Carboidratos', value: Math.round((totalCarbs / totalMacros) * 100), color: '#f97316' },
    { name: 'Gorduras', value: Math.round((totalFats / totalMacros) * 100), color: '#eab308' }
  ] : [
    { name: 'Proteínas', value: 25, color: '#3b82f6' },
    { name: 'Carboidratos', value: 45, color: '#f97316' },
    { name: 'Gorduras', value: 30, color: '#eab308' }
  ];

  const achievements = [
    { 
      id: 1, 
      title: `${timeframe === 'week' ? '7' : timeframe === 'month' ? '30' : '365'} Dias Consecutivos`, 
      description: `Registrou refeições por ${timeframe === 'week' ? 'uma semana' : timeframe === 'month' ? 'um mês' : 'um ano'}`,
      icon: Flame,
      earned: periodStreak >= (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365),
      date: periodStreak >= (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365) ? '15/01/2024' : undefined
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
      earned: totalMealsLogged >= 50,
      progress: Math.min(totalMealsLogged, 50)
    },
    { 
      id: 4, 
      title: 'Mestre da Consistência', 
      description: `Registre refeições por ${timeframe === 'week' ? '7' : '30'} dias`,
      icon: Activity,
      earned: false,
      progress: periodStreak
    }
  ];

  const stats = {
    currentWeight,
    weightChange,
    avgCalories,
    periodStreak,
    mealsLogged: totalMealsLogged,
    perfectDays: currentProgress.filter(day => 
      day.total_calories >= (profile?.daily_calorie_goal || 2000) * 0.9 &&
      day.total_calories <= (profile?.daily_calorie_goal || 2000) * 1.1
    ).length
  };

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'weight' ? 'kg' : entry.dataKey.includes('calorie') ? ' kcal' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading">Estatísticas</h1>
            <p className="text-body text-muted-foreground mt-1">
              Acompanhe seu progresso
            </p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe(period as any)}
                className={timeframe === period ? 'bg-primary' : ''}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Premium Features Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Desbloqueie Recursos Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Relatórios avançados, planos personalizados e muito mais
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowReports(true)}
                disabled={!showReports}
              >
                <FileText size={16} className="mr-2" />
                Relatórios
              </Button>
              <Button 
                className="bg-gradient-nutriai hover:opacity-90"
                size="sm"
                onClick={() => setShowSubscription(true)}
              >
                <Crown size={16} className="mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Peso Atual</p>
                <p className="text-2xl font-bold text-foreground">{stats.currentWeight}kg</p>
                <div className="flex items-center gap-1 mt-1">
                  {stats.weightChange < 0 ? (
                    <TrendingDown size={14} className="text-green-400" />
                  ) : (
                    <TrendingUp size={14} className="text-red-400" />
                  )}
                  <span className={`text-sm ${stats.weightChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(stats.weightChange).toFixed(1)}kg
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">
                  Sequência {timeframe === 'week' ? 'Semanal' : timeframe === 'month' ? 'Mensal' : 'Anual'}
                </p>
                <p className="text-2xl font-bold text-foreground">{stats.periodStreak}</p>
                <p className="text-sm text-muted-foreground">dias</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Calorias Médias</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgCalories}</p>
                <p className="text-sm text-muted-foreground">kcal/dia</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Refeições</p>
                <p className="text-2xl font-bold text-foreground">{stats.mealsLogged}</p>
                <p className="text-sm text-muted-foreground">registradas</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Weight Progress */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-subheading text-foreground">Evolução do Peso</h3>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {stats.weightChange < 0 ? '-' : '+'}{Math.abs(stats.weightChange).toFixed(1)}kg
            </Badge>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Calories Chart */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading text-foreground mb-4">
            Calorias {timeframe === 'week' ? 'da Semana' : timeframe === 'month' ? 'do Mês' : 'do Ano'}
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="consumed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Consumido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span className="text-sm text-muted-foreground">Meta</span>
            </div>
          </div>
        </Card>

        {/* Macros Distribution */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading text-foreground mb-4">Distribuição de Macros</h3>
          
          <div className="flex items-center justify-between">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macrosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {macrosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-3">
              {macrosData.map((macro, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: macro.color }}
                    ></div>
                    <span className="text-sm text-foreground">{macro.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{macro.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading text-foreground mb-4">Conquistas</h3>
          
          <div className="grid gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              
              return (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-muted/10 border-border/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-primary/20' : 'bg-muted/20'
                    }`}>
                      <Icon size={20} className={
                        achievement.earned ? 'text-primary' : 'text-muted-foreground'
                      } />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{achievement.title}</h4>
                        {achievement.earned && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                            <Award size={12} className="mr-1" />
                            Conquistado
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      
                      {achievement.earned ? (
                        achievement.date && (
                          <p className="text-xs text-muted-foreground">
                            Conquistado em {achievement.date}
                          </p>
                        )
                      ) : (
                        achievement.progress !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="text-foreground">
                                {achievement.progress}/{achievement.id === 3 ? 50 : timeframe === 'week' ? 7 : 30}
                              </span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(achievement.progress / (achievement.id === 3 ? 50 : timeframe === 'week' ? 7 : 30)) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Reports Modal */}
      <ReportsModal
        isOpen={showReports}
        onClose={() => setShowReports(false)}
        period={timeframe}
      />

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
                  <p className="text-muted-foreground">Desbloqueie todo o potencial do NutriAI</p>
                </div>
                <Button variant="ghost" onClick={() => setShowSubscription(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    currentPlan="free" // Por enquanto hardcoded
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
