
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface PWAUpdateInfo {
  updateAvailable: boolean;
  waitingWorker: ServiceWorker | null;
}

export const usePWA = () => {
  const [updateInfo, setUpdateInfo] = useState<PWAUpdateInfo>({
    updateAvailable: false,
    waitingWorker: null
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Monitorar status de conexão
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "✅ Conectado",
        description: "Conexão com a internet restaurada",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "⚠️ Offline",
        description: "Você está offline. Algumas funcionalidades podem estar limitadas.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Gerenciar atualizações do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Verificar atualizações a cada 1 hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      });

      // Detectar Service Worker aguardando
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Escutar por novos service workers
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setUpdateInfo({
            updateAvailable: true,
            waitingWorker: event.data.worker
          });
          
          toast({
            title: "🔄 Atualização disponível",
            description: "Uma nova versão do app está disponível!",
          });
        }
      });
    }

    // Detectar prompt de instalação
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const updateApp = () => {
    if (updateInfo.waitingWorker) {
      updateInfo.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setUpdateInfo({
        updateAvailable: false,
        waitingWorker: null
      });
    }
  };

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "🎉 App instalado!",
          description: "NutriAI foi adicionado à sua tela inicial",
        });
      }
      
      setInstallPrompt(null);
    }
  };

  return {
    updateInfo,
    isOnline,
    installPrompt,
    updateApp,
    installApp
  };
};
