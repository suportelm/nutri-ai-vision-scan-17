
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Sparkles, User, Target, Clock, Utensils } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MealPlanWizardProps {
  onBack: () => void;
  onComplete: (plan: any) => void;
}

const MealPlanWizard = ({ onBack, onComplete }: MealPlanWizardProps) => {
  const { profile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [wizardData, setWizardData] = useState({
    // Perfil básico
    dailyCalories: profile?.daily_calorie_goal || 2000,
    mealsPerDay: 4,
    budgetRange: 'medio',
    
    // Restrições alimentares
    restrictions: [] as string[],
    allergies: '',
    
    // Preferências
    cuisineTypes: [] as string[],
    cookingTime: 'medio',
    cookingSkill: 'intermediario',
    
    // Objetivos específicos
    focusArea: '',
    duration: '4',
    notes: ''
  });

  const restrictionOptions = [
    'Vegetariano',
    'Vegano',
    'Sem Glúten',
    'Sem Lactose',
    'Low Carb',
    'Keto',
    'Sem Açúcar',
    'Halal',
    'Kosher'
  ];

  const cuisineOptions = [
    'Brasileira',
    'Mediterrânea',
    'Asiática',
    'Mexicana',
    'Italiana',
    'Indiana',
    'Árabe',
    'Francesa'
  ];

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    setWizardData(prev => ({
      ...prev,
      restrictions: checked 
        ? [...prev.restrictions, restriction]
        : prev.restrictions.filter(r => r !== restriction)
    }));
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    setWizardData(prev => ({
      ...prev,
      cuisineTypes: checked 
        ? [...prev.cuisineTypes, cuisine]
        : prev.cuisineTypes.filter(c => c !== cuisine)
    }));
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    
    try {
      // Criar o prompt especializado em nutrição
      const nutritionPrompt = `
Você é um nutricionista especializado com 20 anos de experiência. Crie um plano alimentar personalizado baseado nos seguintes dados:

PERFIL DO USUÁRIO:
- Meta calórica diária: ${wizardData.dailyCalories} kcal
- Número de refeições: ${wizardData.mealsPerDay}
- Objetivo: ${profile?.goal || 'manter peso'}
- Peso atual: ${profile?.weight || 'não informado'}kg
- Altura: ${profile?.height || 'não informada'}cm
- Idade: ${profile?.age || 'não informada'} anos
- Nível de atividade: ${profile?.activity_level || 'moderado'}

RESTRIÇÕES E PREFERÊNCIAS:
- Restrições alimentares: ${wizardData.restrictions.join(', ') || 'Nenhuma'}
- Alergias: ${wizardData.allergies || 'Nenhuma'}
- Tipos de cozinha preferidos: ${wizardData.cuisineTypes.join(', ') || 'Qualquer'}
- Tempo disponível para cozinhar: ${wizardData.cookingTime}
- Nível culinário: ${wizardData.cookingSkill}
- Orçamento: ${wizardData.budgetRange}
- Duração do plano: ${wizardData.duration} semanas
- Foco especial: ${wizardData.focusArea || 'Saúde geral'}
- Observações: ${wizardData.notes || 'Nenhuma'}

INSTRUÇÕES:
1. Crie um plano alimentar para 7 dias
2. Use apenas alimentos comuns disponíveis no Brasil
3. Inclua receitas simples e práticas
4. Forneça macronutrientes para cada refeição
5. Adicione dicas nutricionais
6. Mantenha o equilíbrio nutricional
7. Considere o orçamento e praticidade

FORMATO DE RESPOSTA (JSON):
{
  "plano": {
    "titulo": "Nome do Plano",
    "descricao": "Descrição breve",
    "duracao": "${wizardData.duration} semanas",
    "objetivo": "Objetivo principal",
    "dias": [
      {
        "dia": 1,
        "data": "Segunda-feira",
        "refeicoes": [
          {
            "tipo": "Café da manhã",
            "nome": "Nome da refeição",
            "ingredientes": ["ingrediente1", "ingrediente2"],
            "preparo": "Modo de preparo",
            "calorias": 350,
            "proteinas": 15,
            "carboidratos": 45,
            "gorduras": 12,
            "tempo_preparo": "15 min"
          }
        ]
      }
    ],
    "lista_compras": ["item1", "item2"],
    "dicas_nutricionais": ["dica1", "dica2"],
    "observacoes": "Observações importantes"
  }
}

Seja preciso, prático e focado na saúde do usuário.
      `;

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          prompt: nutritionPrompt,
          userProfile: {
            ...profile,
            preferences: wizardData
          }
        }
      });

      if (error) throw error;

      onComplete(data);
      toast({
        title: 'Plano Gerado!',
        description: 'Seu plano alimentar personalizado foi criado com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao gerar plano:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o plano. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Perfil Básico</h3>
              <p className="text-muted-foreground">Vamos personalizar seu plano alimentar</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Meta de Calorias Diárias</Label>
                <Input
                  type="number"
                  value={wizardData.dailyCalories}
                  onChange={(e) => setWizardData(prev => ({...prev, dailyCalories: parseInt(e.target.value)}))}
                />
              </div>

              <div>
                <Label>Número de Refeições por Dia</Label>
                <Select value={wizardData.mealsPerDay.toString()} onValueChange={(value) => setWizardData(prev => ({...prev, mealsPerDay: parseInt(value)}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 refeições</SelectItem>
                    <SelectItem value="4">4 refeições</SelectItem>
                    <SelectItem value="5">5 refeições</SelectItem>
                    <SelectItem value="6">6 refeições</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Orçamento para Alimentação</Label>
                <Select value={wizardData.budgetRange} onValueChange={(value) => setWizardData(prev => ({...prev, budgetRange: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo (R$ 10-15/dia)</SelectItem>
                    <SelectItem value="medio">Médio (R$ 15-25/dia)</SelectItem>
                    <SelectItem value="alto">Alto (R$ 25+/dia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Utensils size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Restrições Alimentares</h3>
              <p className="text-muted-foreground">Informe suas restrições e alergias</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Restrições Alimentares</Label>
                <div className="grid grid-cols-2 gap-3">
                  {restrictionOptions.map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox
                        id={restriction}
                        checked={wizardData.restrictions.includes(restriction)}
                        onCheckedChange={(checked) => handleRestrictionChange(restriction, checked as boolean)}
                      />
                      <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Alergias ou Intolerâncias</Label>
                <Textarea
                  placeholder="Ex: amendoim, frutos do mar, lactose..."
                  value={wizardData.allergies}
                  onChange={(e) => setWizardData(prev => ({...prev, allergies: e.target.value}))}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Preferências Culinárias</h3>
              <p className="text-muted-foreground">Como você gosta de cozinhar?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Tipos de Cozinha Favoritos</Label>
                <div className="grid grid-cols-2 gap-3">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={wizardData.cuisineTypes.includes(cuisine)}
                        onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                      />
                      <Label htmlFor={cuisine} className="text-sm">{cuisine}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tempo Disponível para Cozinhar</Label>
                <Select value={wizardData.cookingTime} onValueChange={(value) => setWizardData(prev => ({...prev, cookingTime: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pouco">Pouco (15-30 min)</SelectItem>
                    <SelectItem value="medio">Médio (30-60 min)</SelectItem>
                    <SelectItem value="muito">Muito (60+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nível Culinário</Label>
                <Select value={wizardData.cookingSkill} onValueChange={(value) => setWizardData(prev => ({...prev, cookingSkill: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Objetivos Específicos</h3>
              <p className="text-muted-foreground">Finalize suas preferências</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Duração do Plano (semanas)</Label>
                <Select value={wizardData.duration} onValueChange={(value) => setWizardData(prev => ({...prev, duration: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 semanas</SelectItem>
                    <SelectItem value="4">4 semanas</SelectItem>
                    <SelectItem value="8">8 semanas</SelectItem>
                    <SelectItem value="12">12 semanas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Foco Especial (opcional)</Label>
                <Input
                  placeholder="Ex: anti-inflamatório, energia, ganho de massa..."
                  value={wizardData.focusArea}
                  onChange={(e) => setWizardData(prev => ({...prev, focusArea: e.target.value}))}
                />
              </div>

              <div>
                <Label>Observações Adicionais</Label>
                <Textarea
                  placeholder="Conte mais sobre seus hábitos, horários ou preferências..."
                  value={wizardData.notes}
                  onChange={(e) => setWizardData(prev => ({...prev, notes: e.target.value}))}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div className="flex-1">
            <h1 className="text-heading">Criar Plano Alimentar</h1>
            <p className="text-sm text-muted-foreground">Etapa {currentStep} de 4</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted/20 rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-6 py-6">
        <Card className="bg-gradient-card border-border/50 p-6 max-w-2xl mx-auto">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-gradient-nutriai hover:opacity-90"
              >
                Próximo
                <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={generateMealPlan}
                disabled={isGenerating}
                className="bg-gradient-nutriai hover:opacity-90"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </div>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Gerar Plano com IA
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanWizard;
