
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Loader2, Star } from 'lucide-react';

interface ImageUploadSectionProps {
  imagePreview: string | null;
  isAnalyzing: boolean;
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
}

const ImageUploadSection = ({ 
  imagePreview, 
  isAnalyzing, 
  onImageSelect, 
  onAnalyze 
}: ImageUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 mx-4 mb-6">
      <div className="p-4">
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
                className="w-full h-56 sm:h-64 object-cover rounded-lg shadow-lg"
              />
              <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                Imagem carregada
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1 h-12"
              >
                <Upload size={16} className="mr-2" />
                Trocar Foto
              </Button>
              <Button 
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base font-medium"
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
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/10 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium mb-2">Adicione uma foto da sua refeição</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Fotografe seu prato para análise nutricional automática
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary h-11">
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
  );
};

export default ImageUploadSection;
