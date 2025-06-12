
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Target, 
  Clock, 
  Users, 
  Zap,
  Heart,
  Leaf,
  Dumbbell
} from 'lucide-react';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const mealPlans = [
    {
      id: '1',
      name: 'Perda de Peso Saudável',
      description: 'Plano balanceado para redução gradual de peso',
      duration: '4 semanas',
      calories: '1,400-1,600 cal/dia',
      difficulty: 'Fácil',
      icon: Target,
      color: 'text-secondary',
      features: ['Receitas simples', 'Lista de compras', 'Acompanhamento semanal'],
      macros: { protein: 25, carbs: 45, fat: 30 }
    },
    {
      id: '2',
      name: 'Ganho de Massa Muscular',
      description: 'Alto valor proteico para construção muscular',
      duration: '8 semanas',
      calories: '2,200-2,600 cal/dia',
      difficulty: 'Moderado',
      icon: Dumbbell,
      color: 'text-primary',
      features: ['Alto teor proteico', 'Pré e pós-treino', 'Suplementação'],
      macros: { protein: 35, carbs: 40, fat: 25 }
    },
    {
      id: '3',
      name: 'Dieta Mediterrânea',
      description: 'Baseada em alimentos frescos e naturais',
      duration: '12 semanas',
      calories: '1,800-2,000 cal/dia',
      difficulty: 'Fácil',
      icon: Heart,
      color: 'text-destructive',
      features: ['Anti-inflamatório', 'Rico em ômegas', 'Cardioprotetor'],
      macros: { protein: 20, carbs: 50, fat: 30 }
    },
    {
      id: '4',
      name: 'Plant-Based',
      description: 'Focado em alimentos de origem vegetal',
      duration: '6 semanas',
      calories: '1,600-1,900 cal/dia',
      difficulty: 'Moderado',
      icon: Leaf,
      color: 'text-secondary',
      features: ['100% vegetal', 'Rico em fibras', 'Sustentável'],
      macros: { protein: 18, carbs: 60, fat: 22 }
    }
  ];

  const todayMeals = [
    {
      time: 'Café da Manhã',
      meal: 'Smoothie de Frutas Vermelhas',
      calories: 280,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    },
    {
      time: 'Almoço',
      meal: 'Quinoa com Legumes Grelhados',
      calories: 420,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    },
    {
      time: 'Lanche',
      meal: 'Iogurte Grego com Nozes',
      calories: 180,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    },
    {
      time: 'Jantar',
      meal: 'Salmão com Aspargos',
      calories: 380,
      image: '/lovable-uploads/abf8be56-ed9d-49fc-aa20-49ce383b9ce3.png'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading">Planos Alimentares</h1>
            <p className="text-body text-muted-foreground mt-1">
              Planos personalizados criados por IA
            </p>
          </div>
          <Button className="bg-gradient-nutriai hover:opacity-90">
            <Zap size={16} className="mr-2" />
            Criar Novo
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Current Plan */}
        {selectedPlan && (
          <Card className="bg-gradient-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subheading">Plano Atual</h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Ativo
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Hoje - Segunda-feira</h4>
              <div className="grid grid-cols-2 gap-3">
                {todayMeals.map((meal, index) => (
                  <Card key={index} className="bg-muted/20 border-border/30 p-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={meal.image} 
                        alt={meal.meal}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{meal.time}</p>
                        <p className="text-sm font-medium truncate">{meal.meal}</p>
                        <p className="text-xs text-primary">{meal.calories} cal</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full border-border hover:bg-muted">
                Ver Receitas Completas
              </Button>
            </div>
          </Card>
        )}

        {/* Available Plans */}
        <div>
          <h3 className="text-subheading mb-4">Planos Disponíveis</h3>
          <div className="grid gap-4">
            {mealPlans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={`bg-gradient-card border-border/50 p-6 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlan(isSelected ? null : plan.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-muted/20 ${plan.color}`}>
                      <Icon size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {plan.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {plan.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          {plan.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target size={14} className="text-muted-foreground" />
                          {plan.calories}
                        </div>
                      </div>
                      
                      {/* Macros */}
                      <div className="flex gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">{plan.macros.protein}%</div>
                          <div className="text-xs text-muted-foreground">Proteína</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{plan.macros.carbs}%</div>
                          <div className="text-xs text-muted-foreground">Carbos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{plan.macros.fat}%</div>
                          <div className="text-xs text-muted-foreground">Gorduras</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {plan.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Button className="w-full bg-gradient-nutriai hover:opacity-90">
                        Iniciar Este Plano
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Plan CTA */}
        <Card className="bg-gradient-nutriai/10 border-primary/20 p-6 text-center">
          <ChefHat size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="text-subheading mb-2">Plano Personalizado</h3>
          <p className="text-body text-muted-foreground mb-4">
            Deixe nossa IA criar um plano único baseado nas suas preferências, objetivos e restrições alimentares.
          </p>
          <Button className="bg-gradient-nutriai hover:opacity-90">
            <Zap size={16} className="mr-2" />
            Criar Plano com IA
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Plans;
