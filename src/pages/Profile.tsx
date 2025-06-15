import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Target, 
  Bell, 
  Shield, 
  Download,
  LogOut,
  Edit,
  ChevronRight,
  Camera,
  Save,
  BarChart
} from 'lucide-react';
import GoalsSettings from '@/components/GoalsSettings';
import Privacy from '@/pages/Privacy';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface ProfileProps {
  onNavigate?: (tab: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const { signOut } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showGoalsSettings, setShowGoalsSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    weight: '',
    height: '',
    activity_level: 'moderado',
    goal: 'manter_peso',
    daily_calorie_goal: 2000,
  });

  // Sincronizar formData com dados do perfil sempre que o perfil for carregado
  useEffect(() => {
    if (profile) {
      console.log('Updating form data with profile:', profile);
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        activity_level: profile.activity_level || 'moderado',
        goal: profile.goal || 'manter_peso',
        daily_calorie_goal: profile.daily_calorie_goal || 2000,
      });
    }
  }, [profile]);

  const handleSaveProfile = () => {
    console.log('Saving profile with data:', formData);
    updateProfile({
      full_name: formData.full_name,
      age: formData.age ? parseInt(formData.age.toString()) : null,
      weight: formData.weight ? parseFloat(formData.weight.toString()) : null,
      height: formData.height ? parseInt(formData.height.toString()) : null,
      activity_level: formData.activity_level,
      goal: formData.goal,
      daily_calorie_goal: formData.daily_calorie_goal,
    });
    setIsEditingProfile(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    {
      icon: Target,
      title: 'Metas e Objetivos',
      description: 'Configure suas metas pessoais',
      action: () => setShowGoalsSettings(true)
    },
    {
      icon: BarChart,
      title: 'Ver Estatísticas',
      description: 'Acompanhe seu progresso detalhado',
      action: () => onNavigate?.('stats')
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
      action: () => setShowPrivacy(true)
    }
  ];

  const achievements = [
    { name: 'Primeiro Login', color: 'bg-primary' },
    { name: 'Perfil Completo', color: 'bg-secondary' },
    { name: 'Primeira Refeição', color: 'bg-accent' }
  ];

  if (showGoalsSettings) {
    return <GoalsSettings onBack={() => setShowGoalsSettings(false)} />;
  }

  if (showPrivacy) {
    return <Privacy onBack={() => setShowPrivacy(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-heading">Perfil</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (isEditingProfile) {
                handleSaveProfile();
              } else {
                setIsEditingProfile(true);
              }
            }}
            disabled={isUpdating}
          >
            {isEditingProfile ? <Save size={16} /> : <Edit size={16} />}
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
              <h2 className="text-xl font-semibold">{profile?.full_name || 'Usuário'}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'hoje'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
            <div className="text-center">
              <p className="text-sm font-medium">{profile?.weight || '--'}kg</p>
              <p className="text-xs text-muted-foreground">Peso</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{profile?.height || '--'}cm</p>
              <p className="text-xs text-muted-foreground">Altura</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{profile?.age || '--'}</p>
              <p className="text-xs text-muted-foreground">Anos</p>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-subheading">Informações Pessoais</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  disabled={!isEditingProfile}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  disabled={!isEditingProfile}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  disabled={!isEditingProfile}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  disabled={!isEditingProfile}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="goal">Objetivo Principal</Label>
              <Select 
                value={formData.goal} 
                onValueChange={(value) => setFormData({...formData, goal: value})}
                disabled={!isEditingProfile}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perder_peso">Perder Peso</SelectItem>
                  <SelectItem value="manter_peso">Manter Peso</SelectItem>
                  <SelectItem value="ganhar_peso">Ganhar Peso</SelectItem>
                  <SelectItem value="ganhar_massa">Ganhar Massa Muscular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activity">Nível de Atividade</Label>
              <Select 
                value={formData.activity_level} 
                onValueChange={(value) => setFormData({...formData, activity_level: value})}
                disabled={!isEditingProfile}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentário</SelectItem>
                  <SelectItem value="leve">Levemente Ativo</SelectItem>
                  <SelectItem value="moderado">Moderadamente Ativo</SelectItem>
                  <SelectItem value="intenso">Muito Ativo</SelectItem>
                  <SelectItem value="extremo">Extremamente Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="calories">Meta Diária de Calorias</Label>
              <Input
                id="calories"
                type="number"
                value={formData.daily_calorie_goal}
                disabled={!isEditingProfile}
                onChange={(e) => setFormData({...formData, daily_calorie_goal: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Conquistas</h3>
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
            onClick={handleLogout}
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
