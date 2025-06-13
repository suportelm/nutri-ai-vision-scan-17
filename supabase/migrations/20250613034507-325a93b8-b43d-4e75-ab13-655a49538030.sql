
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height INTEGER,
  activity_level TEXT DEFAULT 'moderado',
  goal TEXT DEFAULT 'manter_peso',
  daily_calorie_goal INTEGER DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de refeições escaneadas
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  calories INTEGER NOT NULL,
  proteins DECIMAL(5,2) DEFAULT 0,
  carbs DECIMAL(5,2) DEFAULT 0,
  fats DECIMAL(5,2) DEFAULT 0,
  fiber DECIMAL(5,2) DEFAULT 0,
  sodium DECIMAL(5,2) DEFAULT 0,
  meal_type TEXT DEFAULT 'other', -- breakfast, lunch, dinner, snack, other
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de progresso diário
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_proteins DECIMAL(5,2) DEFAULT 0,
  total_carbs DECIMAL(5,2) DEFAULT 0,
  total_fats DECIMAL(5,2) DEFAULT 0,
  total_fiber DECIMAL(5,2) DEFAULT 0,
  water_intake DECIMAL(3,1) DEFAULT 0, -- em litros
  exercise_minutes INTEGER DEFAULT 0,
  weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Criar tabela de imagens de refeições
CREATE TABLE public.meal_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  analysis_data JSONB, -- dados da análise da IA
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas RLS para meals
CREATE POLICY "Users can view their own meals" 
  ON public.meals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meals" 
  ON public.meals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" 
  ON public.meals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" 
  ON public.meals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para daily_progress
CREATE POLICY "Users can view their own progress" 
  ON public.daily_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
  ON public.daily_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.daily_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para meal_images
CREATE POLICY "Users can view their meal images" 
  ON public.meal_images 
  FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.meals WHERE id = meal_id));

CREATE POLICY "Users can create meal images" 
  ON public.meal_images 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.meals WHERE id = meal_id));

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar progresso diário automaticamente
CREATE OR REPLACE FUNCTION public.update_daily_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.daily_progress (
    user_id, 
    date, 
    total_calories, 
    total_proteins, 
    total_carbs, 
    total_fats, 
    total_fiber
  )
  SELECT 
    NEW.user_id,
    DATE(NEW.consumed_at),
    SUM(calories),
    SUM(proteins),
    SUM(carbs),
    SUM(fats),
    SUM(fiber)
  FROM public.meals 
  WHERE user_id = NEW.user_id 
    AND DATE(consumed_at) = DATE(NEW.consumed_at)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    total_calories = EXCLUDED.total_calories,
    total_proteins = EXCLUDED.total_proteins,
    total_carbs = EXCLUDED.total_carbs,
    total_fats = EXCLUDED.total_fats,
    total_fiber = EXCLUDED.total_fiber,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger para atualizar progresso diário
CREATE TRIGGER update_daily_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.meals
  FOR EACH ROW EXECUTE PROCEDURE public.update_daily_progress();

-- Criar bucket para imagens de refeições
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-images', 'meal-images', true);

-- Política de storage para meal-images
CREATE POLICY "Users can upload meal images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'meal-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view meal images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'meal-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their meal images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'meal-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
