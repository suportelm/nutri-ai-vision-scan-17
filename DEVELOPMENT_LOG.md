
# NutriAI Vision - Log de Desenvolvimento

## 📋 Visão Geral do Projeto
NutriAI Vision é um aplicativo PWA de análise nutricional usando IA para reconhecimento de alimentos através de fotos.

## 🏗️ Arquitetura Atual
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (Auth + Database + Storage + Edge Functions)
- **IA**: OpenAI GPT-4 Vision via Edge Functions
- **Autenticação**: Supabase Auth com RLS
- **Deploy**: Lovable Platform

## 📊 Status das Funcionalidades

### ✅ Implementado
- [x] Sistema de autenticação completo
- [x] Rotas protegidas em todo o app
- [x] Perfil do usuário com persistência no banco
- [x] Configuração de metas nutricionais
- [x] Análise de IA para reconhecimento de alimentos
- [x] Upload de imagens para Supabase Storage
- [x] Sistema de meals com trigger automático
- [x] Progresso diário calculado automaticamente
- [x] Hook useMeals integrado
- [x] Hook useDailyProgress funcional

### 🔄 Em Desenvolvimento
- [ ] Melhorias na interface de escaneamento
- [ ] Aba Diary com calendário funcional
- [ ] Dashboard em tempo real
- [ ] Visualizações de progresso
- [ ] Sistema de notificações

### 📝 Pendente
- [ ] Integração com Stripe
- [ ] Planos de assinatura
- [ ] Relatórios avançados
- [ ] Sistema de conquistas
- [ ] Compartilhamento social

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
1. **profiles** - Dados do usuário e metas
   - Campos pessoais: full_name, email, age, weight, height
   - Metas: daily_calorie_goal, protein_goal, carb_goal, fat_goal
   - Objetivos: main_objective, target_weight, weekly_weight_goal

2. **meals** - Refeições analisadas
   - Dados nutricionais: calories, proteins, carbs, fats, fiber, sodium
   - Metadados: name, image_url, meal_type, consumed_at

3. **daily_progress** - Progresso diário automático
   - Totais do dia: total_calories, total_proteins, total_carbs, total_fats
   - Extras: water_intake, exercise_minutes, weight

### Triggers Automáticos
- `update_daily_progress()` - Atualiza progresso quando meals são inseridas/modificadas

## 🛠️ Componentes Principais

### Hooks Customizados
- `useAuth()` - Gerenciamento de autenticação
- `useProfile()` - Dados e atualizações do perfil
- `useMeals()` - CRUD de refeições
- `useDailyProgress()` - Progresso diário e semanal

### Páginas
- `Index.tsx` - Dashboard principal (263 linhas - precisa refatoração)
- `Diary.tsx` - Diário alimentar detalhado
- `Profile.tsx` - Perfil e configurações
- `Stats.tsx` - Estatísticas e gráficos

### Componentes
- `ScanMeal.tsx` - Interface de escaneamento (283 linhas - precisa refatoração)
- `ProtectedRoute.tsx` - Guard de autenticação
- `BottomNav.tsx` - Navegação principal

## 🔧 Edge Functions
- `analyze-food-image` - Análise de IA via OpenAI GPT-4 Vision
  - Input: Imagem em base64
  - Output: Dados nutricionais + nível de confiança

## 📱 Fluxo do Usuário
1. **Cadastro/Login** → Redirecionamento automático
2. **Configuração de Perfil** → Dados pessoais + metas
3. **Escaneamento de Refeição** → Upload + análise de IA
4. **Visualização de Progresso** → Dashboard + Diary
5. **Acompanhamento** → Stats + histórico

## 🚨 Problemas Conhecidos
1. **Interface de Escaneamento**: Muito simples, falta feedback visual
2. **Aba Diary**: Calendário não funcional, dados estáticos
3. **Arquivos Grandes**: Index.tsx e ScanMeal.tsx precisam refatoração
4. **UX**: Botões sem feedback, navegação confusa

## 📋 Próximos Passos
1. Melhorar interface de escaneamento com loading states
2. Implementar calendário funcional na aba Diary
3. Refatorar arquivos grandes em componentes menores
4. Adicionar feedback visual em todas as ações
5. Criar sistema de navegação mais intuitivo

## 🔑 Configurações Necessárias
- **OPENAI_API_KEY**: Configurada no Supabase Edge Functions
- **Supabase Storage**: Bucket para meal-images (público)
- **RLS Policies**: Aplicadas em todas as tabelas

## 📊 Métricas de Código
- Total de arquivos TypeScript: ~30
- Componentes principais: 15+
- Hooks customizados: 6
- Edge Functions: 1
- Tabelas no banco: 4

---
*Última atualização: 15/06/2025*
*Status: IA integrada, trabalhando em melhorias de UX*
