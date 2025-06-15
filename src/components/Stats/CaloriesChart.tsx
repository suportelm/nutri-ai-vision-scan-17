
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface CaloriesChartProps {
  caloriesData: Array<{ day: string; consumed: number; goal: number }>;
  timeframe: 'week' | 'month' | 'year';
}

const CaloriesChart = ({ caloriesData, timeframe }: CaloriesChartProps) => {
  const getTitle = () => {
    switch (timeframe) {
      case 'week': return 'Calorias da Semana';
      case 'month': return 'Calorias do Mês';
      case 'year': return 'Calorias do Ano';
      default: return 'Calorias da Semana';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} kcal
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      <h3 className="text-subheading text-foreground mb-4">{getTitle()}</h3>
      
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
  );
};

export default CaloriesChart;
