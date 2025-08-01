import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface AuthProps {
  onAuthSuccess: () => void;
}
const Auth = ({
  onAuthSuccess
}: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !isLogin && !fullName) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        // Login
        const {
          data,
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          toast({
            title: 'Sucesso!',
            description: 'Login realizado com sucesso!'
          });
          onAuthSuccess();
        }
      } else {
        // Cadastro
        const redirectUrl = `${window.location.origin}/`;
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          toast({
            title: 'Sucesso!',
            description: 'Conta criada com sucesso! Verifique seu email para confirmar.'
          });

          // Se o usuário foi criado e confirmado automaticamente
          if (data.user.email_confirmed_at) {
            onAuthSuccess();
          } else {
            // Aguardar confirmação por email
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro durante a autenticação.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-gradient-card border-border/50">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-nutriai rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-heading mb-2">FoodCam AI</h1>
          <p className="text-caption">
            {isLogin ? 'Entre em sua conta' : 'Crie sua conta gratuita'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Seu nome completo" className="pl-10" />
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-10" />
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" className="pl-10 pr-10" />
              <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-nutriai hover:opacity-90" disabled={isLoading}>
            {isLoading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-primary">
            {isLogin ? 'Não tem conta? Criar uma agora' : 'Já tem conta? Fazer login'}
          </Button>
        </div>
      </Card>
    </div>;
};
export default Auth;