
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Loader2, Check, ArrowLeft, Info, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useMeals } from '@/hooks/useMeals';
import { openaiService } from '@/lib/openai';

interface ScanMealProps {
  onClose: () => void;
  onMealAdded: (newMeal: any) => void;
}

const ScanMeal = ({ onClose, onMealAdded }: ScanMealProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createMeal, uploadMealImage, isCreating } = useMeals();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
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
      // Converter imagem para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1];
        
        try {
          // Chamar serviço de análise
          const result = await openaiService.analyzeImage(base64Data);
          
          // Processar resultado
          const processedResult = {
            name: result.foods[0]?.name || 'Alimento não identificado',
            calories: result.nutrition.calories,
            proteins: result.nutrition.protein,
            carbs: result.nutrition.carbs,
            fats: result.nutrition.fat,
            fiber: result.nutrition.fiber,
            sodium: 0, // OpenAI não retorna sódio por padrão
            confidence: result.foods[0]?.confidence || 0,
            recommendations: result.recommendations || []
          };

          setAnalysisResult(processedResult);
          
          toast({
            title: 'Análise Concluída!',
            description: `Alimento identificado com ${Math.round(processedResult.confidence * 100)}% de confiança`,
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
      
      const mealData = {
        name: analysisResult.name,
        calories: analysisResult.calories,
        proteins: analysisResult.proteins,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        fiber: analysisResult.fiber,
        sodium: analysisResult.sodium,
        image_url: imageUrl,
        meal_type: 'other'
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta Confiança';
    if (confidence >= 0.6) return 'Média Confiança';
    return 'Baixa Confiança';
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/50 p-6 pt-12 z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Escanear Refeição</h1>
            <p className="text-sm text-muted-foreground">Fotografe sua comida para análise nutricional</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Upload de Imagem */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Foto da Refeição
            </h3>
            
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview da refeição" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                    Imagem carregada
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload size={16} className="mr-2" />
                    Trocar Foto
                  </Button>
                  <Button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Star size={20} className="mr-2" />
                        Analisar com IA
                      </>
                    )}
                  </Button>
                </div>
                
                {isAnalyzing && (
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="font-medium">Analisando sua refeição...</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nossa IA está identificando os alimentos e calculando os valores nutricionais
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/10 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-medium mb-2">Adicione uma foto da sua refeição</h4>
                <p className="text-muted-foreground mb-4">
                  Fotografe seu prato para análise nutricional automática
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Camera size={16} className="mr-2" />
                  Selecionar Foto
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>

        {/* Resultado da Análise */}
        {analysisResult && (
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800">Análise Concluída</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getConfidenceColor(analysisResult.confidence)}>
                      {getConfidenceText(analysisResult.confidence)} - {Math.round(analysisResult.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-green-800 font-medium">Nome da Refeição</Label>
                  <Input 
                    value={analysisResult.name} 
                    onChange={(e) => setAnalysisResult({...analysisResult, name: e.target.value})}
                    className="mt-1 text-lg font-medium"
                  />
                </div>

                {/* Informações Nutricionais */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-green-800">Calorias (kcal)</Label>
                    <Input 
                      type="number" 
                      value={analysisResult.calories}
                      onChange={(e) => setAnalysisResult({...analysisResult, calories: parseInt(e.target.value) || 0})}
                      className="mt-1 font-bold text-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-green-800">Proteína (g)</Label>
                    <Input 
                      type="number" 
                      value={analysisResult.proteins}
                      onChange={(e) => setAnalysisResult({...analysisResult, proteins: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-green-800">Carboidratos (g)</Label>
                    <Input 
                      type="number" 
                      value={analysisResult.carbs}
                      onChange={(e) => setAnalysisResult({...analysisResult, carbs: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-green-800">Gorduras (g)</Label>
                    <Input 
                      type="number" 
                      value={analysisResult.fats}
                      onChange={(e) => setAnalysisResult({...analysisResult, fats: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Recomendações da IA */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Recomendações da IA</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {analysisResult.recommendations.slice(0, 3).map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={saveMeal}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-medium"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={20} className="mr-2" />
                      Salvar no Diário
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
