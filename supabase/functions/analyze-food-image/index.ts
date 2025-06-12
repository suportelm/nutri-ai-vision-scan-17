
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeImageRequest {
  imageBase64: string;
}

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 }: AnalyzeImageRequest = await req.json();

    if (!imageBase64) {
      throw new Error('Imagem é obrigatória');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    console.log('Analisando imagem com OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
        max_tokens: 1500,
        temperature: 0.1
      })
    });

    console.log('OpenAI Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Erro na API OpenAI: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    console.log('OpenAI Response recebida');
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Nenhuma resposta da OpenAI');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Conteúdo bruto:', content);
      throw new Error('Resposta JSON inválida da OpenAI');
    }

    const result: OpenAIResponse = JSON.parse(jsonMatch[0]);
    console.log('Análise concluída com sucesso');
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Erro na análise:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao analisar a imagem', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
