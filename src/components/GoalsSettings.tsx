
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Activity, 
  Utensils,
  Droplets,
  Weight,
  TrendingUp,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface GoalsSettingsProps {
  onBack: () => void;
}

const GoalsSettings = ({ onBack }: GoalsSettingsProps) => {
  const { profile, updateProfile, isUpdating } = useProfile();
  
  const [goals, setGoals] = useState({
    dailyCalories: 2200,
    dailyWater: 2.5,
    dailyExercise: 60,
    weeklyWeightGoal: 0.5,
    targetWeight: 60,
    proteinGoal: 120,
    carbGoal: 250,
    fatGoal: 70
  });

  const [selectedObjective, setSelectedObjective] = useState('Perder Peso');

  // Sincronizar com dados do perfil quando carregados
  useEffect(() => {
    if (profile) {
      console.log('Loading goals from profile:', profile);
      setGoals({
        dailyCalories: profile.daily_calorie_goal || 2200,
        dailyWater: profile.daily_water_goal || 2.5,
        dailyExercise: profile.daily_exercise_goal || 60,
        weeklyWeightGoal: profile.weekly_weight_goal || 0.5,
        targetWeight: profile.target_weight || 60,
        proteinGoal: profile.protein_goal || 120,
        carbGoal: profile.carb_goal || 250,
        fatGoal: profile.fat_goal || 70
      });
      setSelectedObjective(profile.main_objective || 'Perder Peso');
    }
  }, [profile]);

  const objectives = [
    'Perder Peso',
    'Ganhar Massa Muscular',
    'Manter Peso',
    'Melhorar Saúde',
    'Aumentar Energia'
  ];

  const handleSave = () => {
    console.log('Saving goals to database:', goals, selectedObjective);
    
    updateProfile({
      daily_calorie_goal: goals.dailyCalories,
      daily_water_goal: goals.dailyWater,
      daily_exercise_goal: goals.dailyExercise,
      weekly_weight_goal: goals.weeklyWeightGoal,
      target_weight: goals.targetWeight,
      protein_goal: goals.proteinGoal,
      carb_goal: goals.carbGoal,
      fat_goal: goals.fatGoal,
      main_objective: selectedObjective
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-heading">Metas e Objetivos</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Objetivo Principal */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="text-subheading">Objetivo Principal</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {objectives.map((objective) => (
              <Badge
                key={objective}
                variant={selectedObjective === objective ? 'default' : 'outline'}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedObjective === objective 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedObjective(objective)}
              >
                {objective}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Metas Diárias */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="text-subheading">Metas Diárias</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Utensils size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <Label htmlFor="calories">Calorias Diárias</Label>
                <Input
                  id="calories"
                  type="number"
                  value={goals.dailyCalories}
                  onChange={(e) => setGoals({...goals, dailyCalories: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
              <span className="text-sm text-muted-foreground">kcal</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Droplets size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <Label htmlFor="water">Água Diária</Label>
                <Input
                  id="water"
                  type="number"
                  step="0.1"
                  value={goals.dailyWater}
                  onChange={(e) => setGoals({...goals, dailyWater: parseFloat(e.target.value)})}
                  className="mt-1"
                />
              </div>
              <span className="text-sm text-muted-foreground">L</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-green-500" />
              </div>
              <div className="flex-1">
                <Label htmlFor="exercise">Exercício Diário</Label>
                <Input
                  id="exercise"
                  type="number"
                  value={goals.dailyExercise}
                  onChange={(e) => setGoals({...goals, dailyExercise: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </Card>

        {/* Macronutrientes */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-subheading">Metas de Macronutrientes</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein">Proteína</Label>
                <Input
                  id="protein"
                  type="number"
                  value={goals.proteinGoal}
                  onChange={(e) => setGoals({...goals, proteinGoal: parseInt(e.target.value)})}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">g</span>
              </div>
              <div>
                <Label htmlFor="carbs">Carboidratos</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={goals.carbGoal}
                  onChange={(e) => setGoals({...goals, carbGoal: parseInt(e.target.value)})}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">g</span>
              </div>
              <div>
                <Label htmlFor="fat">Gorduras</Label>
                <Input
                  id="fat"
                  type="number"
                  value={goals.fatGoal}
                  onChange={(e) => setGoals({...goals, fatGoal: parseInt(e.target.value)})}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">g</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Meta de Peso */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Weight className="w-6 h-6 text-primary" />
            <h3 className="text-subheading">Meta de Peso</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetWeight">Peso Alvo</Label>
              <Input
                id="targetWeight"
                type="number"
                value={goals.targetWeight}
                onChange={(e) => setGoals({...goals, targetWeight: parseInt(e.target.value)})}
                className="mt-1"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
            <div>
              <Label htmlFor="weeklyGoal">Meta Semanal</Label>
              <Input
                id="weeklyGoal"
                type="number"
                step="0.1"
                value={goals.weeklyWeightGoal}
                onChange={(e) => setGoals({...goals, weeklyWeightGoal: parseFloat(e.target.value)})}
                className="mt-1"
              />
              <span className="text-xs text-muted-foreground">kg/semana</span>
            </div>
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-nutriai hover:opacity-90 py-4"
          size="lg"
          disabled={isUpdating}
        >
          <Check size={20} className="mr-2" />
          {isUpdating ? 'Salvando...' : 'Salvar Metas'}
        </Button>
      </div>
    </div>
  );
};

export default GoalsSettings;
