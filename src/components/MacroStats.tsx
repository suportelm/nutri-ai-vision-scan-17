
import { Card } from '@/components/ui/card';

interface MacroStatsProps {
  water: number;
  exercise: number;
  food: number;
}

const MacroStats = ({ water, exercise, food }: MacroStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-card border-border/50 p-4 text-center">
        <div className="text-blue-400 text-2xl font-bold mb-1">{water}L</div>
        <div className="text-xs text-muted-foreground">Água</div>
        <div className="text-xs text-muted-foreground/70 mt-1">Meta diária</div>
      </Card>
      
      <Card className="bg-gradient-card border-border/50 p-4 text-center">
        <div className="text-green-400 text-2xl font-bold mb-1">{exercise}</div>
        <div className="text-xs text-muted-foreground">Exercício</div>
        <div className="text-xs text-muted-foreground/70 mt-1">Minutos hoje</div>
      </Card>
      
      <Card className="bg-gradient-card border-border/50 p-4 text-center">
        <div className="text-primary text-2xl font-bold mb-1">{food}</div>
        <div className="text-xs text-muted-foreground">Refeições</div>
        <div className="text-xs text-muted-foreground/70 mt-1">Registradas</div>
      </Card>
    </div>
  );
};

export default MacroStats;
