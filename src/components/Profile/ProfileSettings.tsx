
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Bell, 
  Shield, 
  Download,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface ProfileSettingsProps {
  onGoalsClick: () => void;
  onLogout: () => void;
}

const ProfileSettings = ({ onGoalsClick, onLogout }: ProfileSettingsProps) => {
  const menuItems = [
    {
      icon: Target,
      title: 'Metas e Objetivos',
      description: 'Configure suas metas pessoais',
      action: onGoalsClick
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Gerencie lembretes e alertas',
      action: () => {}
    },
    {
      icon: Download,
      title: 'Exportar Dados',
      description: 'Baixe seus dados em PDF',
      action: () => {}
    },
    {
      icon: Shield,
      title: 'Privacidade',
      description: 'Configurações de privacidade',
      action: () => {}
    }
  ];

  return (
    <>
      <Card className="bg-gradient-card border-border/50 p-6">
        <h3 className="text-subheading mb-4">Configurações</h3>
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                    <Icon size={18} className="text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/50 p-6">
        <Button 
          variant="outline" 
          className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut size={16} className="mr-2" />
          Sair da Conta
        </Button>
      </Card>
    </>
  );
};

export default ProfileSettings;
