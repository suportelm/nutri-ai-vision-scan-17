
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useMeals } from '@/hooks/useMeals';

const ScanMeal = () => {
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
      // Upload da imagem para o Supabase Storage
      const imageUrl = await uploadMealImage(selectedImage);
      
      // Simular análise da IA (aqui você integraria com OpenAI)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resultado mockado da análise
      const mockResult = {
        name: 'Prato de Frango Grelhado com Arroz e Salada',
        calories: 420,
        proteins: 35,
        carbs: 45,
        fats: 8,
        fiber: 6,
        sodium: 680,
        confidence: 0.85
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: 'Sucesso!',
        description: 'Imagem analisada com sucesso!',
      });

    } catch (error: any) {
      console.error('Erro na análise:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao analisar a imagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!analysisResult) return;

    try {
      const imageUrl = selectedImage ? await uploadMealImage(selectedImage) : null;
      
      await createMeal({
        name: analysisResult.name,
        calories: analysisResult.calories,
        proteins: analysisResult.proteins,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        fiber: analysisResult.fiber,
        sodium: analysisResult.sodium,
        image_url: imageUrl,
        meal_type: 'other'
      });

      // Limpar o formulário
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResult(null);
      
    } catch (error: any) {
      console.error('Erro ao salvar refeição:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center gap-4">
          <h1 className="text-heading">Escanear Refeição</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Upload de Imagem */}
        <Card className="bg-gradient-card border-border/50 p-6">
          <h3 className="text-subheading mb-4">Adicionar Imagem</h3>
          
          {imagePreview ? (
            <div className="space-y-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload size={16} className="mr-2" />
                  Trocar Imagem
                </Button>
                <Button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-nutriai hover:opacity-90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Camera size={16} className="mr-2" />
                      Analisar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Adicione uma foto da sua refeição</p>
              <p className="text-muted-foreground">Clique aqui para selecionar uma imagem</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Card>

        {/* Resultado da Análise */}
        {analysisResult && (
          <Card className="bg-gradient-card border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="text-subheading">Análise Concluída</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Nome da Refeição</Label>
                <Input 
                  value={analysisResult.name} 
                  onChange={(e) => setAnalysisResult({...analysisResult, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calorias</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.calories}
                    onChange={(e) => setAnalysisResult({...analysisResult, calories: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Proteína (g)</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.proteins}
                    onChange={(e) => setAnalysisResult({...analysisResult, proteins: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Carboidratos (g)</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.carbs}
                    onChange={(e) => setAnalysisResult({...analysisResult, carbs: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Gorduras (g)</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.fats}
                    onChange={(e) => setAnalysisResult({...analysisResult, fats: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fibras (g)</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.fiber}
                    onChange={(e) => setAnalysisResult({...analysisResult, fiber: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Sódio (mg)</Label>
                  <Input 
                    type="number" 
                    value={analysisResult.sodium}
                    onChange={(e) => setAnalysisResult({...analysisResult, sodium: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button 
                onClick={saveMeal}
                disabled={isCreating}
                className="w-full bg-gradient-nutriai hover:opacity-90 py-4"
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
                    Salvar Refeição
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
