
import { Card } from '@/components/ui/card';
import { Camera, Scan } from 'lucide-react';

interface QuickActionsProps {
  onScanMeal: () => void;
}

const QuickActions = ({ onScanMeal }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card 
        className="bg-slate-800 border-slate-700 p-6 cursor-pointer hover:bg-slate-750 transition-colors"
        onClick={onScanMeal}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera size={24} className="text-white" />
          </div>
          <h3 className="font-semibold mb-1">Scan a Meal</h3>
          <p className="text-xs text-slate-400">Instant Nutrition Insights Made Simple</p>
        </div>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700 p-6 cursor-pointer hover:bg-slate-750 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Scan size={24} className="text-white" />
          </div>
          <h3 className="font-semibold mb-1">Scan a Barcode</h3>
          <p className="text-xs text-slate-400">Decode Access Information Instantly</p>
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;
