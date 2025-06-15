
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Zap, 
  Crown, 
  Star,
  Calendar,
  Users
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  originalPrice?: number;
  popular?: boolean;
  features: string[];
  limits: {
    scans: number | 'unlimited';
    history: string;
    reports: boolean;
    aiPlans: boolean;
  };
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
}

const SubscriptionCard = ({ plan, currentPlan, onSelectPlan, loading }: SubscriptionCardProps) => {
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;
  const discount = plan.originalPrice ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100) : 0;

  const getIcon = () => {
    if (plan.id === 'free') return Users;
    if (plan.id === 'premium') return Star;
    if (plan.id === 'annual') return Crown;
    return Zap;
  };

  const Icon = getIcon();

  return (
    <Card className={`relative p-6 transition-all duration-200 ${
      plan.popular 
        ? 'ring-2 ring-primary border-primary bg-gradient-to-br from-primary/5 to-primary/10' 
        : 'border-border hover:border-primary/50'
    } ${
      isCurrentPlan ? 'ring-2 ring-green-500 border-green-500' : ''
    }`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-nutriai text-white">
          Mais Popular
        </Badge>
      )}

      {isCurrentPlan && (
        <Badge className="absolute -top-2 right-4 bg-green-500 text-white">
          Plano Atual
        </Badge>
      )}

      <div className="text-center mb-6">
        <div className="mb-4">
          <Icon size={48} className={`mx-auto ${
            plan.popular ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        
        <div className="mb-2">
          {plan.originalPrice && (
            <div className="text-sm text-muted-foreground line-through">
              R$ {plan.originalPrice.toFixed(2)}
            </div>
          )}
          <div className="text-3xl font-bold">
            R$ {plan.price.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">
              /{plan.period === 'month' ? 'mês' : 'ano'}
            </span>
          </div>
          {discount > 0 && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-600 mt-1">
              {discount}% de desconto
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="font-semibold">
              {plan.limits.scans === 'unlimited' ? '∞' : plan.limits.scans}
            </div>
            <div className="text-muted-foreground text-xs">Scans/dia</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="font-semibold">{plan.limits.history}</div>
            <div className="text-muted-foreground text-xs">Histórico</div>
          </div>
        </div>

        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              plan.limits.reports ? 'bg-green-500' : 'bg-muted'
            }`} />
            <span className={`text-sm ${
              plan.limits.reports ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Relatórios Avançados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              plan.limits.aiPlans ? 'bg-green-500' : 'bg-muted'
            }`} />
            <span className={`text-sm ${
              plan.limits.aiPlans ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Planos com IA
            </span>
          </div>
        </div>
      </div>

      <Button 
        className={`w-full ${
          plan.popular 
            ? 'bg-gradient-nutriai hover:opacity-90' 
            : isCurrentPlan 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'border border-border hover:bg-muted'
        }`}
        variant={plan.popular || isCurrentPlan ? 'default' : 'outline'}
        onClick={() => onSelectPlan(plan.id)}
        disabled={loading || isCurrentPlan}
      >
        {loading ? (
          'Carregando...'
        ) : isCurrentPlan ? (
          'Plano Atual'
        ) : isFree ? (
          'Plano Gratuito'
        ) : (
          `Assinar ${plan.name}`
        )}
      </Button>

      {plan.period === 'year' && (
        <div className="text-center mt-3">
          <div className="text-xs text-muted-foreground">
            Equivale a R$ {(plan.price / 12).toFixed(2)}/mês
          </div>
        </div>
      )}
    </Card>
  );
};

export default SubscriptionCard;
