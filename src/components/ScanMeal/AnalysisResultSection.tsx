
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Info } from 'lucide-react';

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

interface AnalysisResultSectionProps {
  result: AnalysisResult;
  isCreating: boolean;
  onChange: (updatedResult: AnalysisResult) => void;
  onSave: () => void;
}

const AnalysisResultSection = ({ 
  result, 
  isCreating, 
  onChange, 
  onSave 
}: AnalysisResultSectionProps) => {
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
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 mx-4 mb-6">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800">Análise Concluída</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getConfidenceColor(result.confidence)}>
                {getConfidenceText(result.confidence)} - {Math.round(result.confidence * 100)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Alimentos Detectados */}
        {result.detectedFoods && result.detectedFoods.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Alimentos Identificados
            </h4>
            <div className="space-y-2">
              {result.detectedFoods.map((food, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">{food.name}</span>
                  <div className="flex items-center gap-2">
                    {food.portion && (
                      <span className="text-blue-600 text-xs">{food.portion}</span>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {Math.round(food.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="text-green-800 font-medium">Nome da Refeição</Label>
            <Input 
              value={result.name} 
              onChange={(e) => onChange({...result, name: e.target.value})}
              className="mt-1 text-base font-medium h-12"
              placeholder="Digite o nome da refeição"
            />
          </div>

          {/* Informações Nutricionais */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-green-800 text-sm">Calorias (kcal)</Label>
              <Input 
                type="number" 
                value={result.calories}
                onChange={(e) => onChange({...result, calories: parseInt(e.target.value) || 0})}
                className="mt-1 font-bold text-base h-11"
              />
            </div>
            <div>
              <Label className="text-green-800 text-sm">Proteína (g)</Label>
              <Input 
                type="number" 
                value={result.proteins}
                onChange={(e) => onChange({...result, proteins: parseFloat(e.target.value) || 0})}
                className="mt-1 h-11"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-green-800 text-sm">Carboidratos (g)</Label>
              <Input 
                type="number" 
                value={result.carbs}
                onChange={(e) => onChange({...result, carbs: parseFloat(e.target.value) || 0})}
                className="mt-1 h-11"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-green-800 text-sm">Gorduras (g)</Label>
              <Input 
                type="number" 
                value={result.fats}
                onChange={(e) => onChange({...result, fats: parseFloat(e.target.value) || 0})}
                className="mt-1 h-11"
                step="0.1"
              />
            </div>
          </div>

          {/* Recomendações da IA */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Recomendações da IA</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {result.recommendations.slice(0, 3).map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            onClick={onSave}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-base font-medium h-12"
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
  );
};

export default AnalysisResultSection;
