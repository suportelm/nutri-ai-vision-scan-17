
-- Adicionar campos de metas na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protein_goal INTEGER DEFAULT 120;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS carb_goal INTEGER DEFAULT 250;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fat_goal INTEGER DEFAULT 70;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_water_goal DECIMAL(3,1) DEFAULT 2.5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_exercise_goal INTEGER DEFAULT 60;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weekly_weight_goal DECIMAL(3,1) DEFAULT 0.5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_weight DECIMAL(5,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS main_objective TEXT DEFAULT 'Perder Peso';

-- Corrigir a função de trigger para melhor desempenho
CREATE OR REPLACE FUNCTION public.update_daily_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  target_date DATE;
  target_user_id UUID;
BEGIN
  -- Determinar valores baseado no tipo de operação
  IF TG_OP = 'DELETE' THEN
    target_date := DATE(OLD.consumed_at);
    target_user_id := OLD.user_id;
  ELSE
    target_date := DATE(NEW.consumed_at);
    target_user_id := NEW.user_id;
  END IF;

  -- Atualizar ou inserir progresso diário
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
    target_user_id,
    target_date,
    COALESCE(SUM(calories), 0),
    COALESCE(SUM(proteins), 0),
    COALESCE(SUM(carbs), 0),
    COALESCE(SUM(fats), 0),
    COALESCE(SUM(fiber), 0)
  FROM public.meals 
  WHERE user_id = target_user_id 
    AND DATE(consumed_at) = target_date
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    total_calories = EXCLUDED.total_calories,
    total_proteins = EXCLUDED.total_proteins,
    total_carbs = EXCLUDED.total_carbs,
    total_fats = EXCLUDED.total_fats,
    total_fiber = EXCLUDED.total_fiber,
    updated_at = now();
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Recriar o trigger para funcionar com DELETE também
DROP TRIGGER IF EXISTS update_daily_progress_trigger ON public.meals;
CREATE TRIGGER update_daily_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.meals
  FOR EACH ROW EXECUTE PROCEDURE public.update_daily_progress();
