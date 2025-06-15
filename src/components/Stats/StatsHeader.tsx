
import { Button } from '@/components/ui/button';

interface StatsHeaderProps {
  timeframe: 'week' | 'month' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
}

const StatsHeader = ({ timeframe, onTimeframeChange }: StatsHeaderProps) => {
  return (
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
              onClick={() => onTimeframeChange(period as any)}
              className={timeframe === period ? 'bg-primary' : ''}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
