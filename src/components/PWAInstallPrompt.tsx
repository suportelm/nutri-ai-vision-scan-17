
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Verificar se já está instalado
    const isInstallable = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isInstallable);

    // Verificar se o usuário já dispensou o prompt
    const hasDeclined = localStorage.getItem('pwa-install-declined');
    
    if (!isInstallable && !hasDeclined) {
      // Para iOS, mostrar instruções após 5 segundos
      if (iOS) {
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000);
        return () => clearTimeout(timer);
      }

      // Para Android/Chrome
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'dismissed') {
        localStorage.setItem('pwa-install-declined', 'true');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-declined', 'true');
  };

  if (isInstalled || !showInstallPrompt) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-card border-border/50 p-4 shadow-xl animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-nutriai rounded-lg flex items-center justify-center flex-shrink-0">
          <Smartphone size={24} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-subheading text-foreground mb-1">
            Instalar NutriAI
          </h3>
          
          {isIOS ? (
            <div className="text-sm text-muted-foreground mb-3">
              <p className="mb-2">Para instalar no iPhone/iPad:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Toque no ícone de compartilhar (📤)</li>
                <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                <li>Toque em "Adicionar" no canto superior direito</li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Adicione o NutriAI à sua tela inicial para acesso rápido e experiência completa de app!
            </p>
          )}
          
          <div className="flex gap-2">
            {!isIOS && deferredPrompt && (
              <Button 
                onClick={handleInstallClick}
                size="sm" 
                className="btn-primary text-xs px-3 py-2"
              >
                <Download size={16} className="mr-1" />
                Instalar App
              </Button>
            )}
            
            <Button 
              onClick={handleDismiss}
              variant="ghost" 
              size="sm"
              className="text-xs px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Agora não
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <X size={16} />
        </Button>
      </div>
    </Card>
  );
};

export default PWAInstallPrompt;
