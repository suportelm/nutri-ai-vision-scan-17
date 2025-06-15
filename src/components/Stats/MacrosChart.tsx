
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacroData {
  name: string;
  value: number;
  color: string;
}

interface MacrosChartProps {
  macrosData: MacroData[];
}

const MacrosChart = ({ macrosData }: MacrosChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
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
  );
};

export default MacrosChart;
