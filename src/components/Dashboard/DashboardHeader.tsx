
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  userName: string;
  isOnline: boolean;
  onProfileClick: () => void;
  avatarUrl?: string | null;
}

const DashboardHeader = ({
  userName,
  isOnline,
  onProfileClick,
  avatarUrl
}: DashboardHeaderProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="relative flex items-center justify-between p-6 ios-status-bar my-0">
        <div className="flex items-center gap-3 animate-fade-in">
          <Avatar className="w-12 h-12 shadow-xl">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback className="bg-gradient-nutriai">
              <Camera size={20} className="text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-heading my-[7px]">FoodCam AI</h1>
            <div className="flex items-center gap-2 mx-0 my-0">
              <p className="text-caption">Olá, {userName}!</p>
              {!isOnline && (
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200" 
          onClick={onProfileClick}
        >
          Perfil
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
