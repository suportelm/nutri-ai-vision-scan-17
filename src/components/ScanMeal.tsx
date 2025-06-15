
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
  const { createMeal, uploadMealImage, isCreating } = useMeals();

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
          
          // Criar lista de alimentos detectados com mais detalhes
          const detectedFoods = result.foods?.map((food: any) => ({
            name: food.name,
            confidence: food.confidence || 0,
            portion: food.portion || ''
          })) || [];

          // Criar nome completo da refeição listando todos os alimentos
          const foodNames = detectedFoods.map((food: any) => food.name).join(', ');
          const mealName = foodNames || 'Alimento não identificado';

          const processedResult: AnalysisResult = {
            name: mealName,
            calories: result.nutrition.calories,
            proteins: result.nutrition.protein,
            carbs: result.nutrition.carbs,
            fats: result.nutrition.fat,
            fiber: result.nutrition.fiber,
            sodium: 0,
            confidence: result.foods?.[0]?.confidence || 0,
            recommendations: result.recommendations || [],
            detectedFoods: detectedFoods
          };

          setAnalysisResult(processedResult);
          
          toast({
            title: 'Análise Concluída!',
            description: `${detectedFoods.length} alimento(s) identificado(s) com ${Math.round((processedResult.confidence || 0) * 100)}% de confiança`,
          });
        } catch (error: any) {
          console.error('Erro na análise:', error);
          toast({
            title: 'Erro na Análise',
            description: error.message || 'Não foi possível analisar a imagem',
            variant: 'destructive'
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
    if (!analysisResult) return;

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
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground safe-area-padding">
      <ScanMealHeader onClose={onClose} />
      
      <div className="pb-8 space-y-4">
        <ImageUploadSection 
          imagePreview={imagePreview}
          isAnalyzing={isAnalyzing}
          onImageSelect={handleImageSelect}
          onAnalyze={analyzeImage}
        />

        {analysisResult && (
          <AnalysisResultSection 
            result={analysisResult}
            isCreating={isCreating}
            onChange={setAnalysisResult}
            onSave={saveMeal}
          />
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
