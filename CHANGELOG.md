
# Changelog - FoodCam AI

## Alterações Realizadas

### 1. Mudança de Nome da Aplicação
- **Alterado de:** FoodScan AI
- **Alterado para:** FoodCam AI
- **Arquivos modificados:**
  - `vite.config.ts` - Título da aplicação
  - `public/manifest.json` - Nome e descrição do PWA

### 2. Correção de Duplicação de Refeições
- **Problema:** Refeições apareciam duplicadas após o escaneamento
- **Solução:** 
  - Refinamento da invalidação de queries no `useMeals.tsx`
  - Remoção de callbacks redundantes `onMealAdded` em `ScanMeal.tsx` e `Index.tsx`
  - Implementação de invalidação automática via React Query
- **Resultado:** Refeições são salvas apenas uma vez e a UI atualiza corretamente

### 3. Ajuste de Preço do Plano Premium
- **Alterado de:** R$ 19,90/mês
- **Alterado para:** R$ 25,00/mês
- **Arquivo modificado:** `src/pages/Stats.tsx`

### 4. Navegação para Estatísticas
- **Funcionalidade:** Botão "Ver Estatísticas" na home agora direciona para a aba Stats
- **Arquivos modificados:**
  - `src/components/Dashboard/TodayMeals.tsx` - Adicionada prop `onViewStats`
  - `src/pages/Index.tsx` - Implementada navegação para stats

### 5. Melhoria do Layout Premium (Mobile)
- **Problema:** Banner Premium não se adaptava bem em dispositivos móveis
- **Solução:** 
  - Layout responsivo com `flex-col` para mobile e `flex-row` para desktop
  - Reorganização dos botões: "Upgrade" aparece primeiro no mobile
  - Melhor espaçamento e adaptação para telas pequenas
- **Arquivo modificado:** `src/components/Stats/PremiumBanner.tsx`

## Próximas Melhorias Sugeridas
- [ ] Implementação de loading states
- [ ] Melhoria da experiência offline
- [ ] Otimização de performance das queries
- [ ] Implementação de cache para imagens
