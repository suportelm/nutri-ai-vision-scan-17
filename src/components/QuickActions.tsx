
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';

interface QuickActionsProps {
  onScanMeal: () => void;
}

const QuickActions = ({ onScanMeal }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card 
        className="bg-gradient-card border-border/50 p-6 cursor-pointer hover:bg-muted/20 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
        onClick={onScanMeal}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-nutriai rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Camera size={28} className="text-white" />
          </div>
          <h3 className="text-subheading mb-2 group-hover:text-primary transition-colors">Escanear Refeição</h3>
          <p className="text-caption">Analise instantaneamente o valor nutricional com IA</p>
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;
