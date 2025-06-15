
import { Card } from '@/components/ui/card';

interface CalorieProgressProps {
  current: number;
  goal: number;
  remaining: number;
}

const CalorieProgress = ({ current, goal, remaining }: CalorieProgressProps) => {
  const percentage = (current / goal) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-300 ease-in-out"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground mb-1">Today</span>
            <span className="text-3xl font-bold text-foreground">{current.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground mt-1">Remaining</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Base Goal</div>
          <div className="text-lg font-semibold text-foreground">{goal.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Exercise</div>
          <div className="text-lg font-semibold text-foreground">0</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Food</div>
          <div className="text-lg font-semibold text-foreground">0</div>
        </div>
      </div>
    </Card>
  );
};

export default CalorieProgress;
