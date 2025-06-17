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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-primary" />
          <div>
            <h3 className="text-justify font-semibold mx-0 my-0 py-0 px-0 text-xl">Premium</h3>
            <p className="text-sm text-muted-foreground">
              Relatórios avançados, planos personalizados e muito mais
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onShowReports}>
            <FileText size={16} className="mr-2" />
            Relatórios
          </Button>
          <Button className="bg-gradient-nutriai hover:opacity-90" size="sm" onClick={onShowSubscription}>
            <Crown size={16} className="mr-2" />
            Upgrade
          </Button>
        </div>
      </div>
    </Card>;
};
export default PremiumBanner;