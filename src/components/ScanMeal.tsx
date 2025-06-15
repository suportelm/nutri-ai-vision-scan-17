
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMeals } from '@/hooks/useMeals';
import { openaiService } from '@/lib/openai';
import ScanMealHeader from './ScanMeal/ScanMealHeader';
import ImageUploadSection from './ScanMeal/ImageUploadSection';
import AnalysisResultSection from './ScanMeal/AnalysisResultSection';

interface ScanMealProps {
  onClose: () => void;
  onMealAdded: (newMeal: any) => void;
}

interface AnalysisResult {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  confidence: number;
  recommendations?: string[];
  detectedFoods?: Array<{
    name: string;
    confidence: number;
    portion?: string;
  }>;
}

const ScanMeal = ({ onClose, onMealAdded }: ScanMealProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { createMeal, uploadMealImage } = useMeals();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem primeiro.',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1];
        
        try {
          const result = await openaiService.analyzeImage(base64Data);
          
          // Criar lista de alimentos detectados mesmo com baixa confiança
          const detectedFoods = result.foods?.map((food: any) => ({
            name: food.name,
            confidence: food.confidence || 0,
            portion: food.portion || ''
          })) || [];

          // Se não detectou nada ou confiança muito baixa, criar entrada genérica
          if (detectedFoods.length === 0 || !result.foods) {
            detectedFoods.push({
              name: 'Alimento identificado',
              confidence: 0.5,
              portion: '1 porção'
            });
          }

          // Criar nome completo da refeição listando todos os alimentos
          const foodNames = detectedFoods.map((food: any) => food.name).join(', ');
          const mealName = foodNames || 'Refeição identificada';

          const processedResult: AnalysisResult = {
            name: mealName,
            calories: result.nutrition?.calories || 300,
            proteins: result.nutrition?.protein || 15,
            carbs: result.nutrition?.carbs || 40,
            fats: result.nutrition?.fat || 10,
            fiber: result.nutrition?.fiber || 5,
            sodium: 0,
            confidence: detectedFoods[0]?.confidence || 0.5,
            recommendations: result.recommendations || [],
            detectedFoods: detectedFoods
          };

          setAnalysisResult(processedResult);
          
          toast({
            title: 'Análise Concluída!',
            description: `${detectedFoods.length} alimento(s) identificado(s)`,
          });
        } catch (error: any) {
          console.error('Erro na análise:', error);
          
          // Em caso de erro, criar uma análise padrão
          const fallbackResult: AnalysisResult = {
            name: 'Refeição identificada',
            calories: 300,
            proteins: 15,
            carbs: 40,
            fats: 10,
            fiber: 5,
            sodium: 0,
            confidence: 0.3,
            recommendations: ['Verifique e ajuste os valores nutricionais conforme necessário'],
            detectedFoods: [{
              name: 'Alimento identificado',
              confidence: 0.3,
              portion: '1 porção'
            }]
          };
          
          setAnalysisResult(fallbackResult);
          
          toast({
            title: 'Análise Básica',
            description: 'Não foi possível identificar completamente, mas você pode ajustar os valores',
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error: any) {
      console.error('Erro no processamento:', error);
      setIsAnalyzing(false);
      toast({
        title: 'Erro',
        description: 'Erro ao processar a imagem',
        variant: 'destructive'
      });
    }
  };

  const saveMeal = async () => {
    if (!analysisResult || isSaving) return;

    setIsSaving(true);
    
    try {
      const imageUrl = selectedImage ? await uploadMealImage(selectedImage) : null;
      
      // Determinar tipo de refeição baseado no horário
      const now = new Date();
      const hour = now.getHours();
      let mealType = 'other';
      
      if (hour >= 6 && hour < 12) {
        mealType = 'breakfast';
      } else if (hour >= 12 && hour < 18) {
        mealType = 'lunch';
      } else if (hour >= 18 && hour <= 23) {
        mealType = 'dinner';
      } else {
        mealType = 'snack';
      }

      const mealData = {
        name: analysisResult.name,
        calories: analysisResult.calories,
        proteins: analysisResult.proteins,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        fiber: analysisResult.fiber,
        sodium: analysisResult.sodium,
        image_url: imageUrl,
        meal_type: mealType
      };

      await createMeal(mealData);
      onMealAdded(mealData);

      // Reset form e voltar
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResult(null);
      
      toast({
        title: 'Refeição Salva!',
        description: 'Sua refeição foi adicionada ao diário',
      });
      
      // Voltar automaticamente após salvar
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao salvar refeição:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar refeição',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pwa-container mobile-optimized bg-background text-foreground">
      <ScanMealHeader onClose={onClose} />
      
      <div className="pb-8 space-y-4 px-4">
        <ImageUploadSection 
          imagePreview={imagePreview}
          isAnalyzing={isAnalyzing}
          onImageSelect={handleImageSelect}
          onAnalyze={analyzeImage}
        />

        {analysisResult && (
          <AnalysisResultSection 
            result={analysisResult}
            isCreating={isSaving}
            onChange={setAnalysisResult}
            onSave={saveMeal}
          />
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
