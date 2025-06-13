
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIResponse {
  foods: Array<{
    name: string;
    portion: string;
    confidence: number;
  }>;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  recommendations: string[];
}

export class OpenAIService {
  constructor() {
    // Serviço agora usa Edge Functions seguras do Supabase
  }

  hasApiKey(): boolean {
    // Sempre retorna true pois a chave está configurada no backend
    return true;
  }

  async analyzeImage(imageBase64: string): Promise<OpenAIResponse> {
    try {
      console.log('Iniciando análise da imagem via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: {
          imageBase64: imageBase64
        }
      });

      if (error) {
        console.error('Erro no Edge Function:', error);
        
        // Verificar se o erro contém informações sobre a chave da API
        if (error.message?.includes('inválida') || error.message?.includes('401')) {
          throw new Error('❌ Chave da API OpenAI inválida.\n\nPor favor:\n1. Verifique se você inseriu a chave correta no Supabase\n2. Certifique-se de que a chave começa com "sk-"\n3. Confirme que a chave não expirou');
        } else if (error.message?.includes('não configurada') || error.message?.includes('não encontrada')) {
          throw new Error('❌ Chave da API OpenAI não encontrada.\n\nConfigurção necessária:\n1. Acesse o painel do Supabase\n2. Vá em Project Settings > Environment Variables\n3. Adicione OPENAI_API_KEY com sua chave válida');
        }
        
        throw new Error(error.message || 'Erro ao analisar a imagem');
      }

      if (!data) {
        throw new Error('Nenhum dado retornado da análise');
      }

      // Verificar se há informações de debug no erro
      if (data.error) {
        console.error('Erro detalhado:', data);
        throw new Error(data.error);
      }

      console.log('Análise concluída com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('Erro na análise da imagem:', error);
      
      // Manter a mensagem original se já for específica sobre API key
      if (error.message?.includes('❌') || error.message?.includes('Chave da API')) {
        throw error;
      }
      
      // Tratamento de erro amigável para outros casos
      let errorMessage = 'Não foi possível analisar a imagem. Tente novamente.';
      
      if (error.message?.includes('API')) {
        errorMessage = 'Problema com a configuração da API. Verifique as configurações no Supabase.';
      } else if (error.message?.includes('rede') || error.message?.includes('network')) {
        errorMessage = 'Verifique sua conexão com a internet e tente novamente.';
      }
      
      throw new Error(errorMessage);
    }
  }

  async generateMealPlan(userProfile: {
    age: number;
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
    restrictions: string[];
  }): Promise<any> {
    try {
      // Futuro: implementar via Edge Function também
      console.log('Geração de plano alimentar será implementada em breve');
      return { 
        plan: 'Funcionalidade de plano alimentar será implementada em breve com IA personalizada.' 
      };
    } catch (error) {
      console.error('Erro na geração do plano:', error);
      throw new Error('Não foi possível gerar o plano alimentar. Tente novamente.');
    }
  }
}

export const openaiService = new OpenAIService();
