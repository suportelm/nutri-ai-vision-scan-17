
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ScanMealHeaderProps {
  onClose: () => void;
}

const ScanMealHeader = ({ onClose }: ScanMealHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/50 p-4 pt-8 z-10 safe-top">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Escanear Refeição</h1>
          <p className="text-sm text-muted-foreground">Fotografe sua comida para análise nutricional</p>
        </div>
      </div>
    </div>
  );
};

export default ScanMealHeader;
