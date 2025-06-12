
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Target, 
  Bell, 
  Shield, 
  Download,
  LogOut,
  Edit,
  Key,
  ChevronRight,
  Camera
} from 'lucide-react';
import { openaiService } from '@/lib/openai';

const Profile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    age: 28,
    weight: 65,
    height: 165,
    activityLevel: 'Moderadamente Ativo',
    goal: 'Perder Peso',
    joinDate: '15/10/2023'
  });

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // Here you would save to database
  };

  const menuItems = [
    {
      icon: Target,
      title: 'Metas e Objetivos',
      description: 'Configure suas metas pessoais',
      action: () => {}
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Gerencie lembretes e alertas',
      action: () => {}
    },
    {
      icon: Key,
      title: 'Configurar OpenAI',
      description: 'Chave da API para análise de IA',
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

  const achievements = [
    { name: '7 Dias Consecutivos', color: 'bg-primary' },
    { name: 'Meta de Proteína', color: 'bg-secondary' },
    { name: 'Primeiro Scan', color: 'bg-accent' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-heading">Perfil</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            <Edit size={16} />
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-nutriai rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <Button 
                size="sm" 
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
              >
                <Camera size={14} />
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Membro desde {userProfile.joinDate}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
            <div className="text-center">
              <p className="text-sm font-medium">{userProfile.weight}kg</p>
              <p className="text-xs text-muted-foreground">Peso</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{userProfile.height}cm</p>
              <p className="text-xs text-muted-foreground">Altura</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{userProfile.age}</p>
              <p className="text-xs text-muted-foreground">Anos</p>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-subheading">Informações Pessoais</h3>
            {isEditingProfile && (
              <Button size="sm" onClick={handleSaveProfile} className="bg-primary">
                Salvar
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={userProfile.name}
                  disabled={!isEditingProfile}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={userProfile.age}
                  disabled={!isEditingProfile}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={userProfile.weight}
                  disabled={!isEditingProfile}
                  onChange={(e) => setUserProfile({...userProfile, weight: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userProfile.height}
                  disabled={!isEditingProfile}
                  onChange={(e) => setUserProfile({...userProfile, height: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="goal">Objetivo Principal</Label>
              <Input
                id="goal"
                value={userProfile.goal}
                disabled={!isEditingProfile}
                onChange={(e) => setUserProfile({...userProfile, goal: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="activity">Nível de Atividade</Label>
              <Input
                id="activity"
                value={userProfile.activityLevel}
                disabled={!isEditingProfile}
                onChange={(e) => setUserProfile({...userProfile, activityLevel: e.target.value})}
              />
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Conquistas Recentes</h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={`${achievement.color}/20 text-white border-0`}
              >
                {achievement.name}
              </Badge>
            ))}
          </div>
        </Card>

        {/* API Key Status */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-subheading">OpenAI Integration</h3>
              <p className="text-sm text-muted-foreground">
                {openaiService.hasApiKey() 
                  ? 'Configurado e funcionando' 
                  : 'Configure para usar análise de IA'
                }
              </p>
            </div>
            <Badge 
              variant={openaiService.hasApiKey() ? 'default' : 'destructive'}
              className={openaiService.hasApiKey() ? 'bg-secondary' : ''}
            >
              {openaiService.hasApiKey() ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </Card>

        {/* Menu Items */}
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

        {/* Logout */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <Button 
            variant="outline" 
            className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <LogOut size={16} className="mr-2" />
            Sair da Conta
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
