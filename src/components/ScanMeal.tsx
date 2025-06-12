
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Camera, Upload } from 'lucide-react';

interface ScanMealProps {
  onClose: () => void;
}

const ScanMeal = ({ onClose }: ScanMealProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, this would call OpenAI API
    setTimeout(() => {
      setAnalysisResult({
        foods: [
          { name: 'Mixed Green Salad', portion: '1 bowl' },
          { name: 'Cherry Tomatoes', portion: '6 pieces' },
          { name: 'Avocado', portion: '1/4 medium' }
        ],
        calories: 285,
        macros: {
          protein: 8,
          carbs: 15,
          fat: 24,
          fiber: 12
        }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
        <h1 className="text-lg font-semibold">Scan a Meal</h1>
        <div className="w-8" />
      </div>

      <div className="px-6">
        {!selectedImage ? (
          /* Image Selection */
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 border-2 border-dashed p-8 text-center">
              <Camera size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">Take a Photo of Your Meal</h3>
              <p className="text-slate-400 mb-6">Our AI will analyze the nutrition content instantly</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera size={20} className="mr-2" />
                  Open Camera
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Upload size={20} className="mr-2" />
                  Choose from Gallery
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
          </div>
        ) : (
          /* Image Analysis */
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <img 
                src={selectedImage} 
                alt="Selected meal"
                className="w-full h-64 object-cover rounded-lg"
              />
            </Card>

            {isAnalyzing ? (
              <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Scanning in progress</h3>
                <p className="text-slate-400">Our AI is analyzing your meal...</p>
              </Card>
            ) : analysisResult ? (
              <div className="space-y-4">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-medium text-blue-400">Detected Foods:</h4>
                    {analysisResult.foods.map((food: any, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-slate-700 last:border-0">
                        <span>{food.name}</span>
                        <span className="text-slate-400">{food.portion}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{analysisResult.calories}</div>
                      <div className="text-xs text-slate-400">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{analysisResult.macros.fiber}g</div>
                      <div className="text-xs text-slate-400">Fiber</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{analysisResult.macros.protein}g</div>
                      <div className="text-xs text-slate-400">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{analysisResult.macros.carbs}g</div>
                      <div className="text-xs text-slate-400">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{analysisResult.macros.fat}g</div>
                      <div className="text-xs text-slate-400">Fat</div>
                    </div>
                  </div>
                </Card>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-4"
                  onClick={onClose}
                >
                  Add to Food Diary
                </Button>
              </div>
            ) : (
              <Button 
                onClick={analyzeImage}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4"
              >
                Analyze with AI
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanMeal;
