
# NutriAI Vision - Log de Desenvolvimento

## 📋 Visão Geral do Projeto
NutriAI Vision é um aplicativo PWA de análise nutricional usando IA para reconhecimento de alimentos através de fotos.

## 🏗️ Arquitetura Atual
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (Auth + Database + Storage + Edge Functions)
- **IA**: OpenAI GPT-4 Vision via Edge Functions
- **Autenticação**: Supabase Auth com RLS
- **Pagamentos**: Stripe (Em implementação)
- **Deploy**: Lovable Platform

## 📊 Status das Funcionalidades

### ✅ Implementado e Funcional
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
- [x] Aba Diary com calendário funcional
- [x] Classificação automática de refeições por horário
- [x] Sistema otimizado de lanches (sem duplicação)
- [x] Interface melhorada com cores consistentes em dark mode
- [x] Aba Stats com dados reais conectados
- [x] Gráficos interativos com tooltips customizados
- [x] Sistema de conquistas dinâmico
- [x] Estatísticas baseadas em dados reais do usuário
- [x] MacroStats component atualizado para dark mode

### 🔄 Em Desenvolvimento
- [x] **Períodos de Tempo na Aba Stats** - Filtros mês/ano (Em implementação)
- [x] **Relatórios Personalizados** - Análises avançadas (Em implementação)
- [x] **Integração com Stripe** - Planos mensais e anuais (Em implementação)

### 📝 Próxima Prioridade
- [ ] Melhorias no Scanner - Interface mobile e feedback visual
- [ ] Refatoração - Quebrar arquivos grandes em componentes menores
- [ ] Sistema de Notificações - Implementar quando usuário atinge metas

### 📝 Backlog
- [ ] Compartilhamento social
- [ ] Backup e sincronização
- [ ] Mode offline

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

4. **subscribers** - Assinantes e planos (Em implementação)
   - Dados Stripe: stripe_customer_id, subscription_tier
   - Status: subscribed, subscription_end

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
- `Diary.tsx` - Diário alimentar detalhado ✅ OTIMIZADO
- `Profile.tsx` - Perfil e configurações
- `Stats.tsx` - Estatísticas e gráficos ✅ CONECTADO COM DADOS REAIS
- `Plans.tsx` - Planos alimentares (Em desenvolvimento para Stripe)

### Componentes
- `ScanMeal.tsx` - Interface de escaneamento (283 linhas - precisa refatoração)
- `MealCard.tsx` - Card de refeição ✅ OTIMIZADO
- `MacroStats.tsx` - Estatísticas de macros ✅ DARK MODE OTIMIZADO
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
6. **Assinatura** → Planos premium (Em implementação)

## 🎨 Melhorias Recentes na Aba Stats
### Dados Reais Conectados ✅ IMPLEMENTADO
- ✅ **Estatísticas baseadas em dados reais**: Peso, calorias médias, sequência de dias, total de refeições
- ✅ **Gráficos interativos**: Tooltips customizados em todos os gráficos
- ✅ **Evolução do peso**: Gráfico de linha com dados simulados baseados no perfil
- ✅ **Calorias semanais**: Gráfico de barras com dados reais do `useDailyProgress`
- ✅ **Distribuição de macros**: Calculada dinamicamente das refeições recentes

### Sistema de Conquistas Dinâmico ✅ IMPLEMENTADO
- ✅ **"7 Dias Consecutivos"**: Ativa automaticamente quando `weekStreak >= 7`
- ✅ **"Scanner Expert"**: Progresso baseado no número real de refeições (`totalMealsLogged`)
- ✅ **"Mestre da Consistência"**: Progresso baseado na sequência real de dias
- ✅ **Cores consistentes**: Dark mode otimizado com cores do design system

### Próximas Implementações 🔄 EM DESENVOLVIMENTO
- 🔄 **Filtros de Período**: Implementar funcionalidade para semana/mês/ano
- 🔄 **Relatórios Avançados**: Análises detalhadas por período
- 🔄 **Planos Premium**: Integração com Stripe para assinaturas

## 💳 Integração Stripe - Planos de Assinatura

### Planos Propostos
1. **Básico** - Gratuito
   - Escaneamento limitado (5 por dia)
   - Estatísticas básicas
   - Histórico de 7 dias

2. **Premium** - R$ 19,90/mês
   - Escaneamento ilimitado
   - Estatísticas avançadas
   - Histórico completo
   - Relatórios personalizados
   - Planos alimentares com IA

3. **Anual** - R$ 199,00/ano (2 meses grátis)
   - Todos os recursos Premium
   - Desconto de 16%
   - Suporte prioritário

### Edge Functions Necessárias
- `create-checkout` - Criar sessão de checkout Stripe
- `check-subscription` - Verificar status da assinatura
- `customer-portal` - Portal de gerenciamento do cliente

## 🚨 Problemas Conhecidos
1. **Interface de Escaneamento**: Muito simples, falta feedback visual
2. **Arquivos Grandes**: Index.tsx e ScanMeal.tsx precisam refatoração
3. **UX**: Botões sem feedback, navegação confusa

## 📋 Roadmap Priorizado

### 🎯 Fase Atual: Funcionalidades Premium
1. **Períodos na Aba Stats** - Filtros mês/ano funcionais
2. **Relatórios Personalizados** - Análises avançadas
3. **Integração Stripe** - Sistema de assinaturas completo

### 🔮 Próximas Fases
1. **Melhorias UX** - Scanner e interface geral
2. **Refatoração** - Organização do código
3. **Notificações** - Sistema de alertas
4. **Funcionalidades Sociais** - Compartilhamento

## 🔑 Configurações Necessárias
- **OPENAI_API_KEY**: ✅ Configurada no Supabase Edge Functions
- **STRIPE_SECRET_KEY**: 🔄 Será configurada para assinaturas
- **Supabase Storage**: ✅ Bucket para meal-images (público)
- **RLS Policies**: ✅ Aplicadas em todas as tabelas

## 📊 Métricas de Código
- Total de arquivos TypeScript: ~35
- Componentes principais: 20+
- Hooks customizados: 6
- Edge Functions: 1 (+ 3 em desenvolvimento)
- Tabelas no banco: 4 (+ 1 em desenvolvimento)

## 🎯 Status Atual
- ✅ **Aba Diary**: 100% Funcional e otimizada
- ✅ **Aba Stats**: Dados reais conectados com gráficos interativos
- ✅ **Sistema de Conquistas**: Dinâmico e baseado em dados reais
- ✅ **Interface Dark Mode**: Cores consistentes em todo o app
- 🔄 **Próximo**: Implementar períodos mês/ano, relatórios e Stripe

---
*Última atualização: 15/06/2025*
*Status: Iniciando implementação de funcionalidades premium*
