
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Camera, Upload, AlertCircle } from 'lucide-react';
import { openaiService } from '@/lib/openai';
import { toast } from '@/hooks/use-toast';

interface ScanMealProps {
  onClose: () => void;
  onMealAdded?: (meal: any) => void;
}

const ScanMeal = ({ onClose, onMealAdded }: ScanMealProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'Por favor, selecione uma imagem menor que 5MB.',
          variant: 'destructive'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    if (!openaiService.hasApiKey()) {
      setError('Chave da API OpenAI não configurada');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert base64 to just the data part
      const base64Data = selectedImage.split(',')[1];
      
      const result = await openaiService.analyzeImage(base64Data);
      setAnalysisResult(result);

      toast({
        title: 'Análise concluída!',
        description: 'Sua refeição foi analisada com sucesso.',
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Erro ao analisar a imagem');
      toast({
        title: 'Erro na análise',
        description: 'Não foi possível analisar a imagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMeal = () => {
    if (analysisResult && onMealAdded) {
      const meal = {
        id: Date.now().toString(),
        name: analysisResult.foods.map((f: any) => f.name).join(', '),
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        calories: analysisResult.nutrition.calories,
        image: selectedImage,
        nutrition: analysisResult.nutrition,
        foods: analysisResult.foods,
        recommendations: analysisResult.recommendations
      };
      
      onMealAdded(meal);
    }
    onClose();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 border-b border-border/50">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
        <h1 className="text-heading">Escanear Refeição</h1>
        <div className="w-8" />
      </div>

      <div className="px-6 pb-6">
        {!selectedImage ? (
          /* Image Selection */
          <div className="space-y-6 mt-6">
            <Card className="bg-gradient-card border-border/50 border-2 border-dashed p-8 text-center">
              <Camera size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-subheading mb-2">Fotografe sua Refeição</h3>
              <p className="text-body text-muted-foreground mb-6">
                Nossa IA analisará o conteúdo nutricional instantaneamente
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-nutriai hover:opacity-90"
                  size="lg"
                >
                  <Camera size={20} className="mr-2" />
                  Abrir Câmera
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-border hover:bg-muted"
                  size="lg"
                >
                  <Upload size={20} className="mr-2" />
                  Escolher da Galeria
                </Button>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                capture="environment"
                className="hidden"
              />
            </Card>

            {!openaiService.hasApiKey() && (
              <Card className="bg-muted/20 border-destructive/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">API Key Necessária</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure sua chave da API OpenAI nas configurações para usar a análise de IA.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* Image Analysis */
          <div className="space-y-6 mt-6">
            <Card className="bg-gradient-card border-border/50 p-4 overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Refeição selecionada"
                className="w-full h-64 object-cover rounded-lg"
              />
            </Card>

            {error && (
              <Card className="bg-destructive/10 border-destructive/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Erro na Análise</h4>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {isAnalyzing ? (
              <Card className="bg-gradient-card border-border/50 p-8 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-subheading mb-2">Analisando com IA</h3>
                <p className="text-body text-muted-foreground">
                  Nossa IA está identificando os alimentos e calculando os nutrientes...
                </p>
              </Card>
            ) : analysisResult ? (
              <div className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-card border-border/50 p-6">
                  <h3 className="text-subheading mb-4 text-primary">Resultado da Análise</h3>
                  
                  {/* Detected Foods */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-medium text-secondary">Alimentos Detectados:</h4>
                    {analysisResult.foods?.map((food: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                        <div>
                          <span className="font-medium">{food.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({Math.round(food.confidence * 100)}% confiança)
                          </span>
                        </div>
                        <span className="text-muted-foreground">{food.portion}</span>
                      </div>
                    ))}
                  </div>

                  {/* Nutrition Summary */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {analysisResult.nutrition?.calories || 0}
                      </div>
                      <div className="text-caption">Calorias</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        {analysisResult.nutrition?.fiber || 0}g
                      </div>
                      <div className="text-caption">Fibras</div>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {analysisResult.nutrition?.protein || 0}g
                      </div>
                      <div className="text-caption">Proteína</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {analysisResult.nutrition?.carbs || 0}g
                      </div>
                      <div className="text-caption">Carboidratos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {analysisResult.nutrition?.fat || 0}g
                      </div>
                      <div className="text-caption">Gorduras</div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="font-medium text-secondary mb-2">Recomendações:</h4>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysisResult(null);
                      setError(null);
                    }}
                    className="border-border hover:bg-muted"
                  >
                    Nova Foto
                  </Button>
                  <Button 
                    className="bg-gradient-nutriai hover:opacity-90"
                    onClick={handleAddMeal}
                  >
                    Adicionar ao Diário
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={analyzeImage}
                className="w-full bg-gradient-nutriai hover:opacity-90"
                size="lg"
                disabled={!openaiService.hasApiKey()}
              >
                {!openaiService.hasApiKey() ? 'Configure a API Key primeiro' : 'Analisar com IA'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
