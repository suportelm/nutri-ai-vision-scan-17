
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Calendar, 
  Target, 
  TrendingUp,
  BarChart3,
  PieChart,
  Clock
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: 'week' | 'month' | 'year';
}

const ReportsModal = ({ isOpen, onClose, period }: ReportsModalProps) => {
  const [selectedReport, setSelectedReport] = useState<string>('summary');
  const { periodProgress } = useDailyProgress(undefined, period);
  const { meals } = useMeals();
  const { profile } = useProfile();

  const periodLabels = {
    week: 'Semanal',
    month: 'Mensal',
    year: 'Anual'
  };

  const generateSummaryData = () => {
    const totalDays = periodProgress.length;
    const activeDays = periodProgress.filter(day => day.total_calories > 0).length;
    const avgCalories = totalDays > 0 
      ? Math.round(periodProgress.reduce((sum, day) => sum + day.total_calories, 0) / totalDays)
      : 0;
    const goalCalories = profile?.daily_calorie_goal || 2000;
    const adherenceRate = Math.round((avgCalories / goalCalories) * 100);

    return {
      totalDays,
      activeDays,
      avgCalories,
      goalCalories,
      adherenceRate,
      consistencyRate: Math.round((activeDays / totalDays) * 100)
    };
  };

  const generateTrendData = () => {
    return periodProgress.map((day, index) => ({
      date: new Date(day.date).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      calories: day.total_calories,
      proteins: day.total_proteins,
      carbs: day.total_carbs,
      fats: day.total_fats,
      goal: profile?.daily_calorie_goal || 2000
    }));
  };

  const summaryData = generateSummaryData();
  const trendData = generateTrendData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'calories' || entry.dataKey === 'goal' ? ' kcal' : 'g'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const reportTypes = [
    { id: 'summary', name: 'Resumo Executivo', icon: BarChart3 },
    { id: 'trends', name: 'Tendências', icon: TrendingUp },
    { id: 'goals', name: 'Metas vs Realizado', icon: Target },
    { id: 'patterns', name: 'Padrões Alimentares', icon: PieChart }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Relatório {periodLabels[period]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-full">
          {/* Sidebar com tipos de relatório */}
          <div className="w-48 space-y-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Button
                  key={report.id}
                  variant={selectedReport === report.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedReport(report.id)}
                >
                  <Icon size={16} className="mr-2" />
                  {report.name}
                </Button>
              );
            })}
          </div>

          {/* Conteúdo do relatório */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {selectedReport === 'summary' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Consistência</h3>
                    <div className="text-2xl font-bold text-primary">
                      {summaryData.consistencyRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {summaryData.activeDays} de {summaryData.totalDays} dias ativos
                    </p>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Aderência à Meta</h3>
                    <div className="text-2xl font-bold text-primary">
                      {summaryData.adherenceRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {summaryData.avgCalories} kcal/dia em média
                    </p>
                  </Card>
                </div>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Progresso de Calorias</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Consumido"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="goal" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          name="Meta"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            )}

            {selectedReport === 'trends' && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Tendências de Macronutrientes</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="proteins" fill="#3b82f6" name="Proteínas" />
                      <Bar dataKey="carbs" fill="#f97316" name="Carboidratos" />
                      <Bar dataKey="fats" fill="#eab308" name="Gorduras" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {selectedReport === 'goals' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Performance vs Metas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Calorias</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(summaryData.adherenceRate, 100)}%` }}
                          />
                        </div>
                        <Badge variant={summaryData.adherenceRate >= 90 ? "default" : "secondary"}>
                          {summaryData.adherenceRate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedReport === 'patterns' && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Padrões de Horário</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="font-medium">Horários Mais Ativos</span>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>Café da Manhã: 7h - 9h</div>
                      <div>Almoço: 12h - 14h</div>
                      <div>Jantar: 18h - 20h</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium">Refeições por Tipo</span>
                    <div className="space-y-1 text-muted-foreground">
                      <div>Café da Manhã: 35%</div>
                      <div>Almoço: 30%</div>
                      <div>Jantar: 25%</div>
                      <div>Lanches: 10%</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Relatório gerado em {new Date().toLocaleDateString('pt-BR')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button className="bg-gradient-nutriai hover:opacity-90">
              <Download size={16} className="mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsModal;
