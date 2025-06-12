
import { Card } from '@/components/ui/card';

interface MacroStatsProps {
  water: number;
  exercise: number;
  food: number;
}

const MacroStats = ({ water, exercise, food }: MacroStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-slate-800 border-slate-700 p-4 text-center">
        <div className="text-blue-400 text-2xl font-bold mb-1">{water}L</div>
        <div className="text-xs text-slate-400">Water Goal</div>
        <div className="text-xs text-slate-500 mt-1">Connect to track</div>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700 p-4 text-center">
        <div className="text-blue-400 text-2xl font-bold mb-1">{exercise}</div>
        <div className="text-xs text-slate-400">Exercise</div>
        <div className="text-xs text-slate-500 mt-1">Minutes today</div>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700 p-4 text-center">
        <div className="text-blue-400 text-2xl font-bold mb-1">{food}</div>
        <div className="text-xs text-slate-400">Food</div>
        <div className="text-xs text-slate-500 mt-1">Meals logged</div>
      </Card>
    </div>
  );
};

export default MacroStats;
