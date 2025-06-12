
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
        throw new Error(error.message || 'Erro ao analisar a imagem');
      }

      if (!data) {
        throw new Error('Nenhum dado retornado da análise');
      }

      console.log('Análise concluída com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('Erro na análise da imagem:', error);
      
      // Tratamento de erro amigável para o usuário
      let errorMessage = 'Não foi possível analisar a imagem. Tente novamente.';
      
      if (error.message?.includes('API')) {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
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
