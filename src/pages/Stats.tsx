
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
  Fire
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
  Cell
} from 'recharts';

const Stats = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  // Mock data
  const weightData = [
    { date: '01/12', weight: 75.2 },
    { date: '08/12', weight: 74.8 },
    { date: '15/12', weight: 74.5 },
    { date: '22/12', weight: 74.1 },
    { date: '29/12', weight: 73.8 },
    { date: '05/01', weight: 73.5 },
    { date: '12/01', weight: 73.2 }
  ];

  const caloriesData = [
    { day: 'Seg', consumed: 1850, goal: 2000 },
    { day: 'Ter', consumed: 1920, goal: 2000 },
    { day: 'Qua', consumed: 2100, goal: 2000 },
    { day: 'Qui', consumed: 1780, goal: 2000 },
    { day: 'Sex', consumed: 2050, goal: 2000 },
    { day: 'Sáb', consumed: 2200, goal: 2000 },
    { day: 'Dom', consumed: 1950, goal: 2000 }
  ];

  const macrosData = [
    { name: 'Proteínas', value: 25, color: '#3b82f6' },
    { name: 'Carboidratos', value: 45, color: '#10b981' },
    { name: 'Gorduras', value: 30, color: '#f59e0b' }
  ];

  const achievements = [
    { 
      id: 1, 
      title: '7 Dias Consecutivos', 
      description: 'Registrou refeições por uma semana',
      icon: Fire,
      earned: true,
      date: '15/01/2024'
    },
    { 
      id: 2, 
      title: 'Meta de Proteína', 
      description: 'Atingiu meta de proteína 5 dias seguidos',
      icon: Target,
      earned: true,
      date: '12/01/2024'
    },
    { 
      id: 3, 
      title: 'Scanner Expert', 
      description: 'Escaneou 50 refeições com IA',
      icon: Zap,
      earned: false,
      progress: 32
    },
    { 
      id: 4, 
      title: 'Mestre da Consistência', 
      description: 'Registre refeições por 30 dias',
      icon: Activity,
      earned: false,
      progress: 18
    }
  ];

  const stats = {
    currentWeight: 73.2,
    weightChange: -1.8,
    avgCalories: 1978,
    weekStreak: 7,
    mealsLogged: 156,
    perfectDays: 12
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
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption">Peso Atual</p>
                <p className="text-2xl font-bold">{stats.currentWeight}kg</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown size={14} className="text-secondary" />
                  <span className="text-sm text-secondary">
                    {Math.abs(stats.weightChange)}kg
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption">Sequência</p>
                <p className="text-2xl font-bold">{stats.weekStreak}</p>
                <p className="text-sm text-muted-foreground">dias</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Fire className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption">Calorias Médias</p>
                <p className="text-2xl font-bold">{stats.avgCalories}</p>
                <p className="text-sm text-muted-foreground">kcal/dia</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption">Refeições</p>
                <p className="text-2xl font-bold">{stats.mealsLogged}</p>
                <p className="text-sm text-muted-foreground">registradas</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Weight Progress */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-subheading">Evolução do Peso</h3>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              -1.8kg
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
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Calories Chart */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Calorias da Semana</h3>
          
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
                <Bar dataKey="consumed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">Consumido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span className="text-sm">Meta</span>
            </div>
          </div>
        </Card>

        {/* Macros Distribution */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Distribuição de Macros</h3>
          
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
                    <span className="text-sm">{macro.name}</span>
                  </div>
                  <span className="text-sm font-medium">{macro.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Conquistas</h3>
          
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
                        <h4 className="font-medium">{achievement.title}</h4>
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
                        <p className="text-xs text-muted-foreground">
                          Conquistado em {achievement.date}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progresso</span>
                            <span>{achievement.progress}/50</span>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress! / 50) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
