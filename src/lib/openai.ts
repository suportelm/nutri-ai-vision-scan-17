
import { toast } from '@/hooks/use-toast';

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
  private apiKey: string = 'sk-proj-XYZ123ABC'; // Chave configurada internamente

  constructor() {
    // Chave já está configurada internamente
  }

  hasApiKey(): boolean {
    return true; // Sempre retorna true pois a chave está configurada
  }

  async analyzeImage(imageBase64: string): Promise<OpenAIResponse> {
    try {
      console.log('Iniciando análise da imagem...');
      console.log('Sending request to OpenAI API...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em nutrição. Analise imagens de alimentos e forneça informações nutricionais detalhadas em português. 
              Retorne uma resposta JSON com a seguinte estrutura:
              {
                "foods": [{"name": "nome do alimento", "portion": "porção estimada", "confidence": 0.85}],
                "nutrition": {"calories": 450, "protein": 25, "carbs": 45, "fat": 15, "fiber": 8, "sugar": 12},
                "recommendations": ["sugestão 1", "sugestão 2"]
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analise esta imagem de refeição e forneça informações nutricionais detalhadas em formato JSON.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });

      console.log('OpenAI API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenAI API Response:', data);
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('Raw content:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]);
      console.log('Parsed result:', result);
      
      return result;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Você é um nutricionista certificado. Crie planos alimentares personalizados baseados no perfil do usuário.'
            },
            {
              role: 'user',
              content: `Crie um plano alimentar de 7 dias para:
              Idade: ${userProfile.age} anos
              Peso: ${userProfile.weight}kg
              Altura: ${userProfile.height}cm
              Atividade: ${userProfile.activityLevel}
              Objetivo: ${userProfile.goal}
              Restrições: ${userProfile.restrictions.join(', ')}
              
              Retorne JSON com refeições diárias, calorias e macros.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      // Try to parse JSON, if fails return raw content
      try {
        return JSON.parse(content);
      } catch {
        return { plan: content };
      }
    } catch (error) {
      console.error('Meal plan generation error:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
