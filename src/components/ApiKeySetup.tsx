
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Key, Eye, EyeOff } from 'lucide-react';
import { openaiService } from '@/lib/openai';
import { toast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onKeySet: () => void;
}

const ApiKeySetup = ({ onKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira uma chave da API válida.',
        variant: 'destructive'
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Set the API key
      openaiService.setApiKey(apiKey);
      
      toast({
        title: 'Sucesso!',
        description: 'Chave da API OpenAI configurada com sucesso.',
      });
      
      onKeySet();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao validar a chave da API. Verifique se está correta.',
        variant: 'destructive'
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-gradient-card border-border/50">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-nutriai rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-heading mb-2">Configurar OpenAI</h1>
          <p className="text-caption">
            Para usar a análise de IA, configure sua chave da API OpenAI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API OpenAI</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sua chave será armazenada localmente e nunca compartilhada
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-nutriai hover:opacity-90"
            disabled={isValidating}
          >
            {isValidating ? 'Validando...' : 'Configurar'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Como obter sua chave:</h3>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Acesse platform.openai.com</li>
            <li>2. Faça login em sua conta</li>
            <li>3. Vá para API Keys</li>
            <li>4. Clique em "Create new secret key"</li>
            <li>5. Copie e cole aqui</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
