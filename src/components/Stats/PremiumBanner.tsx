
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, FileText } from 'lucide-react';
interface PremiumBannerProps {
  onShowReports: () => void;
  onShowSubscription: () => void;
}
const PremiumBanner = ({
  onShowReports,
  onShowSubscription
}: PremiumBannerProps) => {
  return <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Crown className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-justify font-semibold mx-0 my-0 py-0 px-0 text-xl">Premium</h3>
            <p className="text-sm text-muted-foreground">
              Relatórios avançados, planos personalizados e muito mais
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            className="bg-gradient-nutriai hover:opacity-90 w-full sm:w-auto order-1 sm:order-2" 
            size="sm" 
            onClick={onShowSubscription}
          >
            <Crown size={16} className="mr-2" />
            Upgrade
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto order-2 sm:order-1" 
            onClick={onShowReports}
          >
            <FileText size={16} className="mr-2" />
            Relatórios
          </Button>
        </div>
      </div>
    </Card>;
};
export default PremiumBanner;
