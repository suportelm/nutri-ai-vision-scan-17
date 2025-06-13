import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Camera, Upload, AlertCircle, Wifi, RefreshCw, Info } from 'lucide-react';
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
      // Check file size (max 4MB como validado no backend)
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'Por favor, selecione uma imagem menor que 4MB.',
          variant: 'destructive'
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setError(null);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert base64 to just the data part
      const base64Data = selectedImage.split(',')[1];
      
      console.log('Iniciando análise da imagem...');
      console.log('Tamanho da imagem (base64):', base64Data.length, 'caracteres');
      
      const result = await openaiService.analyzeImage(base64Data);
      console.log('Resultado da análise:', result);
      
      setAnalysisResult(result);

      toast({
        title: 'Análise concluída!',
        description: 'Sua refeição foi analisada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro na análise:', error);
      const errorMessage = error.message || 'Erro ao analisar a imagem';
      setError(errorMessage);
      
      toast({
        title: 'Erro na análise',
        description: errorMessage,
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
      
      toast({
        title: 'Refeição adicionada!',
        description: 'Sua refeição foi salva no diário.',
      });
    }
    onClose();
  };

  const retryAnalysis = () => {
    setError(null);
    analyzeImage();
  };

  const resetImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 border-b border-border/50">
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:scale-105 transition-transform">
          <X size={20} />
        </Button>
        <h1 className="text-heading">Escanear Refeição</h1>
        <div className="w-8" />
      </div>

      <div className="px-6 pb-6">
        {!selectedImage ? (
          /* Image Selection */
          <div className="space-y-6 mt-6">
            <Card className="bg-gradient-card border-border/50 border-2 border-dashed p-8 text-center card-interactive">
              <Camera size={48} className="mx-auto mb-4 text-primary animate-pulse-slow" />
              <h3 className="text-subheading mb-2">Fotografe sua Refeição</h3>
              <p className="text-body text-muted-foreground mb-6">
                Nossa IA analisará o conteúdo nutricional instantaneamente
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full btn-primary"
                  size="lg"
                >
                  <Camera size={20} className="mr-2" />
                  Abrir Câmera
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full btn-secondary"
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

            <Card className="bg-muted/20 border-primary/20 p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Dicas para melhor análise</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Use boa iluminação</li>
                    <li>• Mostre toda a refeição</li>
                    <li>• Evite sombras na foto</li>
                    <li>• Máximo 4MB por imagem</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-muted/20 border-primary/20 p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Sistema Seguro</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Análise de IA protegida e segura. Suas imagens são processadas com total privacidade.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Image Analysis */
          <div className="space-y-6 mt-6">
            <Card className="bg-gradient-card border-border/50 p-4 overflow-hidden animate-scale-in">
              <img 
                src={selectedImage} 
                alt="Refeição selecionada"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </Card>

            {error && (
              <Card className="bg-destructive/10 border-destructive/20 p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive">Erro na Análise</h4>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={retryAnalysis}
                        disabled={isAnalyzing}
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Tentar Novamente
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={resetImage}
                      >
                        Nova Foto
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {isAnalyzing ? (
              <Card className="bg-gradient-card border-border/50 p-8 text-center animate-pulse">
                <div className="loading-spinner mx-auto mb-4"></div>
                <h3 className="text-subheading mb-2">Analisando com IA</h3>
                <p className="text-body text-muted-foreground">
                  Nossa IA está identificando os alimentos e calculando os nutrientes...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Isso pode levar alguns segundos...
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
                    onClick={resetImage}
                    className="btn-secondary"
                  >
                    Nova Foto
                  </Button>
                  <Button 
                    className="btn-primary"
                    onClick={handleAddMeal}
                  >
                    Adicionar ao Diário
                  </Button>
                </div>
              </div>
            ) : !error && (
              <Button 
                onClick={analyzeImage}
                className="w-full btn-primary"
                size="lg"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
