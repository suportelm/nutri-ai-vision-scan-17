# Documentação do Projeto FoodCam AI

## Visão Geral
FoodCam AI é um aplicativo web progressivo (PWA) para análise nutricional automatizada usando inteligência artificial. O objetivo é facilitar o acompanhamento alimentar, metas nutricionais e progresso de saúde, utilizando reconhecimento de alimentos por imagem.

## Tecnologias Utilizadas
- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **IA:** OpenAI GPT-4 Vision (via função edge)
- **Pagamentos:** Stripe (em implementação)
- **Deploy:** Lovable Platform

## Estrutura de Dados
- **profiles:** Dados do usuário e metas
- **meals:** Refeições analisadas (nutrição, imagem, tipo, horário)
- **daily_progress:** Progresso diário (totais, água, exercício, peso)
- **subscribers:** Assinantes e planos (em implementação)

## Funcionalidades Principais
- Reconhecimento de alimentos por imagem
- Gestão de perfil e metas
- Diário alimentar e histórico
- Progresso diário/semanal
- Estatísticas e conquistas
- Planos alimentares personalizados (em desenvolvimento)
- Assinatura premium (limite de escaneamentos, relatórios avançados)
- Integração Stripe para pagamentos (em desenvolvimento)
- PWA (instalável, modo offline planejado)

## Status Atual
- Funcionalidades básicas implementadas e testadas
- Premium: relatórios, filtros de período e Stripe em desenvolvimento
- Refatoração de arquivos grandes pendente
- Melhorias de UX e feedback visual no scanner planejadas

## Próximos Passos
- Finalizar integração Stripe
- Implementar planos alimentares personalizados com IA
- Refatorar componentes grandes
- Melhorar experiência mobile e modo offline
- Padronizar branding para "FoodCam AI" em todo o projeto

## Observações
- Última atualização: Junho/2025
- Para dúvidas técnicas, consulte também DEVELOPMENT_LOG.md e CHANGELOG.md

---

> Adicione aqui decisões técnicas, padrões de código, endpoints, exemplos de uso, e qualquer informação relevante para onboarding de novos membros ou continuidade do projeto. 