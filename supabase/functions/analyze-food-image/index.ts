
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
    console.log('=== Iniciando análise de imagem ===');
    
    const { imageBase64 }: AnalyzeImageRequest = await req.json();

    if (!imageBase64) {
      console.error('Erro: Imagem não fornecida');
      throw new Error('Imagem é obrigatória');
    }

    // Validar tamanho da imagem (máximo ~4MB em base64)
    if (imageBase64.length > 5500000) {
      console.error('Erro: Imagem muito grande');
      throw new Error('Imagem muito grande. Máximo 4MB.');
    }

    // Verificar se a chave da OpenAI está configurada
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Verificando configuração da chave OpenAI...');
    
    if (!openaiApiKey) {
      console.error('ERRO CRÍTICO: OPENAI_API_KEY não encontrada no ambiente');
      throw new Error('Chave da API OpenAI não está configurada no servidor. Verifique as configurações do Supabase.');
    }

    // Verificar formato da chave
    if (!openaiApiKey.startsWith('sk-')) {
      console.error('ERRO: Chave OpenAI não tem formato válido');
      throw new Error('Chave da API OpenAI tem formato inválido. Deve começar com "sk-"');
    }

    if (openaiApiKey.length < 20) {
      console.error('ERRO: Chave OpenAI muito curta');
      throw new Error('Chave da API OpenAI parece estar incompleta');
    }

    console.log('✓ Chave OpenAI encontrada e formato válido');
    console.log('Tamanho da imagem:', imageBase64.length, 'caracteres');
    
    console.log('Enviando requisição para OpenAI...');

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
            content: `Você é um especialista em nutrição. Analise imagens de alimentos e forneça informações nutricionais detalhadas em português brasileiro. 
            Retorne APENAS uma resposta JSON válida com esta estrutura exata:
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
                text: 'Analise esta imagem de refeição e forneça informações nutricionais detalhadas em formato JSON válido.'
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

    console.log('Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro detalhado da OpenAI:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401) {
        console.error('❌ ERRO 401: Chave da API inválida ou expirada');
        throw new Error('A chave da API OpenAI está inválida ou expirada. Verifique se você inseriu a chave correta no Supabase.');
      } else if (response.status === 429) {
        console.error('❌ ERRO 429: Limite de uso excedido');
        throw new Error('Limite de uso da API OpenAI excedido. Tente novamente em alguns minutos.');
      } else if (response.status === 413) {
        throw new Error('Imagem muito grande para a API OpenAI');
      } else {
        throw new Error(`Erro na API OpenAI: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
      }
    }

    const data = await response.json();
    console.log('✓ Resposta recebida da OpenAI com sucesso');
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('Nenhum conteúdo na resposta da OpenAI');
      throw new Error('Nenhuma resposta válida da OpenAI');
    }

    console.log('Conteúdo bruto da OpenAI:', content.substring(0, 200) + '...');

    // Parse JSON response com melhor tratamento
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Tentar encontrar JSON em blocos de código
      jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1];
      }
    }
    
    if (!jsonMatch) {
      console.error('Resposta não contém JSON válido:', content);
      throw new Error('Resposta da OpenAI não está em formato JSON válido');
    }

    let result: OpenAIResponse;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('JSON problemático:', jsonMatch[0]);
      throw new Error('Formato JSON inválido na resposta da OpenAI');
    }

    // Validar estrutura da resposta
    if (!result.foods || !result.nutrition || !result.recommendations) {
      console.error('Estrutura de resposta inválida:', result);
      throw new Error('Estrutura de resposta inválida da OpenAI');
    }

    console.log('✓ Análise concluída com sucesso');
    console.log('Alimentos detectados:', result.foods.length);
    console.log('Calorias:', result.nutrition.calories);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('=== ERRO NA ANÁLISE ===');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    // Mensagens de erro mais específicas para o usuário
    let userMessage = 'Erro interno do servidor';
    
    if (error.message.includes('não está configurada') || error.message.includes('não encontrada')) {
      userMessage = 'Chave da API OpenAI não configurada. Entre em contato com o administrador.';
    } else if (error.message.includes('inválida') || error.message.includes('expirada') || error.message.includes('401')) {
      userMessage = 'Chave da API OpenAI inválida. Verifique se a chave está correta no painel do Supabase.';
    } else if (error.message.includes('muito grande')) {
      userMessage = 'Imagem muito grande. Use uma imagem menor que 4MB.';
    } else if (error.message.includes('limite') || error.message.includes('429')) {
      userMessage = 'Serviço temporariamente sobrecarregado. Tente novamente em alguns minutos.';
    } else if (error.message.includes('JSON')) {
      userMessage = 'Erro no processamento da resposta. Tente novamente.';
    } else if (error.message.includes('rede') || error.message.includes('network')) {
      userMessage = 'Erro de conexão. Verifique sua internet.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: userMessage,
        details: error.message,
        timestamp: new Date().toISOString(),
        debug: {
          hasApiKey: !!Deno.env.get('OPENAI_API_KEY'),
          keyFormat: Deno.env.get('OPENAI_API_KEY')?.startsWith('sk-') || false
        }
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
