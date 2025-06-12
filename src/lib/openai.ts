
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
  private apiKey: string | null = null;

  constructor() {
    // In production, this would come from environment variables
    // For now, we'll use localStorage for development
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async analyzeImage(imageBase64: string): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: `You are a nutrition expert AI. Analyze food images and provide detailed nutritional information. 
              Return a JSON response with the following structure:
              {
                "foods": [{"name": "food name", "portion": "estimated portion", "confidence": 0.85}],
                "nutrition": {"calories": 450, "protein": 25, "carbs": 45, "fat": 15, "fiber": 8, "sugar": 12},
                "recommendations": ["suggestion 1", "suggestion 2"]
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this meal image and provide detailed nutritional information in JSON format.'
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

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]);
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
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a certified nutritionist. Create personalized meal plans based on user profiles.'
            },
            {
              role: 'user',
              content: `Create a 7-day meal plan for:
              Age: ${userProfile.age}
              Weight: ${userProfile.weight}kg
              Height: ${userProfile.height}cm
              Activity: ${userProfile.activityLevel}
              Goal: ${userProfile.goal}
              Restrictions: ${userProfile.restrictions.join(', ')}
              
              Return JSON with daily meals, calories, and macros.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Meal plan generation error:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
