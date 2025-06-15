
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface WeightChartProps {
  weightData: Array<{ date: string; weight: number }>;
  weightChange: number;
}

const WeightChart = ({ weightData, weightChange }: WeightChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}kg
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-subheading text-foreground">Evolução do Peso</h3>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          {weightChange < 0 ? '-' : '+'}{Math.abs(weightChange).toFixed(1)}kg
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
  );
};

export default WeightChart;
