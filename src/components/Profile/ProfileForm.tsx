
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormProps {
  formData: any;
  setFormData: (data: any) => void;
  isEditingProfile: boolean;
}

const ProfileForm = ({ formData, setFormData, isEditingProfile }: ProfileFormProps) => {
  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-subheading">Informações Pessoais</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
};

export default ProfileForm;
