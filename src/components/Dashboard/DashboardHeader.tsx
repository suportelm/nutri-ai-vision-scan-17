import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface DashboardHeaderProps {
  userName: string;
  isOnline: boolean;
  onProfileClick: () => void;
}
const DashboardHeader = ({
  userName,
  isOnline,
  onProfileClick
}: DashboardHeaderProps) => {
  return <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="relative flex items-center justify-between p-6 ios-status-bar">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 bg-gradient-nutriai rounded-full flex items-center justify-center shadow-xl">
            <Camera size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-heading my-[30px]">FoodCam AI</h1>
            <div className="flex items-center gap-2">
              <p className="text-caption">Olá, {userName}!</p>
              {!isOnline && <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                  Offline
                </span>}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200" onClick={onProfileClick}>
          Perfil
        </Button>
      </div>
    </div>;
};
export default DashboardHeader;