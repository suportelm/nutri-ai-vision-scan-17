
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Flame, Activity } from 'lucide-react';

interface StatsData {
  currentWeight: number;
  weightChange: number;
  periodStreak: number;
  avgCalories: number;
  mealsLogged: number;
}

interface QuickStatsGridProps {
  stats: StatsData;
  timeframe: 'week' | 'month' | 'year';
}

const QuickStatsGrid = ({ stats, timeframe }: QuickStatsGridProps) => {
  const getPeriodLabel = () => {
    switch (timeframe) {
      case 'week': return 'Semanal';
      case 'month': return 'Mensal';
      case 'year': return 'Anual';
      default: return 'Semanal';
    }
  };

  return (
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
            <p className="text-caption text-muted-foreground">Sequência {getPeriodLabel()}</p>
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
  );
};

export default QuickStatsGrid;
