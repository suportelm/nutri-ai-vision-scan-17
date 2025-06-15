
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Shield,
  Eye,
  Bell,
  Download,
  Trash2,
  Lock,
  Database
} from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy = ({ onBack }: PrivacyProps) => {
  const [settings, setSettings] = useState({
    dataCollection: true,
    analytics: true,
    marketing: false,
    profileVisibility: false,
    shareProgress: false,
    notifications: true,
    location: false,
    crashReports: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const privacySettings = [
    {
      id: 'dataCollection',
      title: 'Coleta de Dados',
      description: 'Permitir coleta de dados para melhorar a experiência',
      icon: Database,
      value: settings.dataCollection
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Dados anônimos para análise de uso do app',
      icon: Eye,
      value: settings.analytics
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Receber comunicações promocionais',
      icon: Bell,
      value: settings.marketing
    },
    {
      id: 'profileVisibility',
      title: 'Perfil Público',
      description: 'Tornar seu perfil visível para outros usuários',
      icon: Shield,
      value: settings.profileVisibility
    },
    {
      id: 'shareProgress',
      title: 'Compartilhar Progresso',
      description: 'Permitir compartilhamento do seu progresso',
      icon: Eye,
      value: settings.shareProgress
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Receber notificações push',
      icon: Bell,
      value: settings.notifications
    },
    {
      id: 'location',
      title: 'Localização',
      description: 'Usar localização para recomendações',
      icon: Lock,
      value: settings.location
    },
    {
      id: 'crashReports',
      title: 'Relatórios de Erro',
      description: 'Enviar relatórios automáticos de erro',
      icon: Shield,
      value: settings.crashReports
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-heading">Privacidade</h1>
            <p className="text-body text-muted-foreground mt-1">
              Gerencie suas configurações de privacidade
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Privacy Settings */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Configurações de Privacidade</h3>
          
          <div className="space-y-4">
            {privacySettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                      <Icon size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={setting.id} className="font-medium cursor-pointer">
                        {setting.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={setting.value}
                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Data Management */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Gerenciamento de Dados</h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download size={16} className="mr-2" />
              Baixar Meus Dados
            </Button>
            
            <Button variant="outline" className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10">
              <Trash2 size={16} className="mr-2" />
              Excluir Minha Conta
            </Button>
          </div>
        </Card>

        {/* Privacy Policy */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Políticas</h3>
          
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              Política de Privacidade
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              Termos de Uso
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              Política de Cookies
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <Button className="w-full bg-gradient-nutriai hover:opacity-90">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default Privacy;
