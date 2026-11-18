# MAPA DE CONTINUIDADE — ESCRITÓRIO DOS AGENTES

**Projeto:** Escritório dos Agentes / Pixel Agents Mobile
**Data da última revisão:** 2026-11-18
**Repositório:** `sunwu8/pixel-agents` (fork do `pixel-agents-hq/pixel-agents`)
**Branch de trabalho:** `dev/mobile-office-v1`
**PR de acompanhamento:** https://github.com/sunwu8/pixel-agents/pull/1 (rascunho)
**Status:** Protótipo experimental em desenvolvimento; NÃO implantado e NÃO validado em Android.
**Ler este mapa no início de toda retomada e atualizar após alterações verificadas.**

## 1. Objetivo e princípios

Criar um escritório virtual com personagens pixel art, estilo jogo de gerenciamento, principalmente para celular Android, que permita acompanhar trabalho **real** de agentes de IA, tarefas, bloqueios e atualizações de código. O aplicativo deve poder supervisionar múltiplos projetos no futuro.

- **Independente do CineDoc Engine.** Este repositório é exclusivo do escritório. **Não modificar** `sunwu8/CineDoc-Engine` como parte desta iniciativa. O CineDoc é um projeto monitorável futuro, não uma dependência estrutural nem lugar para armazenar este mapa.
- Estética aprovada: **pixel art de escritório vista de cima, similar à referência Pixel Agents apresentada pelo usuário**; prioridade para Android e interface de toque. PC pode usar tema retrô alternativo futuramente; evitar construir duas aplicações.
- O escritório visual não deve fingir que a IA está trabalhando. Diferenciar visualmente **DEMO** / **REAL** / **DESCONHECIDO**. Nunca transformar ausência de eventos em status `idle` presumido.
- Preservar base e licença MIT do upstream; respeitar autoria de assets e licenças individuais.

## 2. O que existe de fato na branch de desenvolvimento

Arquivos criados e alterados:
- `companion/index.html`: protótipo HTML/CSS/JS responsivo sem dependências próprias. Começa mostrando **imagem estática** do escritório original (`webview-ui/public/office.png`) e permite alternar para simulação interativa simples, **ainda com emoji em lugar de sprites reais**. Os três personagens demonstrativos Claude, Codex e ChatGPT podem ser selecionados; botões pausam/reiniciam movimentos.
- `companion/github-feed.js`: busca **somente commits públicos** da própria branch via GitHub REST API sem token e renderiza links e erros. Não oferece GitHub privado nem status de agentes; sujeito aos limites da API pública.
- `companion/README.md`: escopo, instruções e etapas.
- O escritório original do upstream reside em `webview-ui/`; há `server/`, `core/` e integração VS Code. O upstream documenta execução standalone com `npx pixel-agents` e Node >=20.

**Verificações realizadas:** arquivos confirmados no GitHub. **Não há teste em navegador/Android ou execução CI desta alteração confirmada.** Não afirmar que está publicado, conectado ao Claude ou pronto para produção.

## 3. Separação dos sistemas

- **Escritório (este repo):** interface, renderização, integração com eventos, painel de missões e controle condicionado a autenticação.
- **CineDoc Engine (outro repo):** motor cinematográfico e pipeline de geração de vídeos. Seu mapa de continuidade, automações e branch permanecem independentes.
- No futuro pode haver **conector somente leitura** para GitHub do CineDoc, **sem colocar tokens privados no frontend**.
- Uma sessão Claude via **Antigravity CLI** não é automaticamente uma sessão Claude Code. Verificar capacidades/documentação/eventos reais antes de anunciar integração, ativar comandos remotos ou aprovações.

## 4. Estado dos marcos

| Marco | Status | Evidência / limite |
|---|---|---|
| Fork no GitHub | CONFIRMADO | `sunwu8/pixel-agents` |
| Branch isolada | CONFIRMADO | `dev/mobile-office-v1` |
| PR em rascunho | CONFIRMADO | #1 |
| Protótipo mobile HTML | CÓDIGO ENVIADO | `companion/index.html` |
| Arte Pixel Agents original | PARCIAL | Screenshot estática, **não** renderer |
| Feed de commits públicos | CÓDIGO ENVIADO | `companion/github-feed.js`; sem teste de navegador confirmado |
| Personagens sprite reais animados | PENDENTE | Integrar `webview-ui` e estados reais |
| Feed de GitHub privado | PENDENTE | Backend autenticado |
| Integração Antigravity/Claude | PENDENTE | Verificar evento/provider disponível |
| Acesso Android e deploy | PENDENTE | Ambiente, segurança e testes |
| Aprovações remotas de agentes | FORA DA V1 | Exige integração e permissões explícitas |

## 5. Próxima tarefa prioritária

**Substituir a demonstração visual baseada em screenshot/emoji por integração do renderer pixel art original**, preferencialmente adaptando `webview-ui/` em vez de manter um segundo motor gráfico em `companion/`. Estudar componentes do renderer, fluxo servidor-WebSocket e opções de acesso mobile; fazer pequena alteração validável, com testes quando disponíveis, sem quebrar o upstream.

Depois:
1. Garantir visualização mobile (viewport, toque, zoom, painéis).
2. Eventos reais do GitHub público primeiro, com testes de erro/cota; privado somente via servidor autenticado.
3. Abstração de conectores de agentes com estados `unknown`, `idle`, `busy`, `blocked`, `finished`, baseados em eventos verificáveis.
4. Testes em navegador e Android; CI e documentação de execução/deploy.
5. Somente depois: personalização, mapa/escritório expandido, reuniões, interface de missões e autorizações remotas.

## 6. Política de desenvolvimento

- Trabalhar exclusivamente neste fork, branch de desenvolvimento ou nova branch de recurso. **Não fazer merge em `main` sem autorização.**
- Não inserir tokens de GitHub, dados privados, segredos ou credenciais no código cliente, commits ou PRs.
- Não inventar testes, tempo de execução, status de agentes ou progresso real.
- Antes de alterar arquitetura, verificar implementação upstream para reaproveitar componentes; evitar duplicações desnecessárias.
- Registrar cada mudança com evidência (arquivo, commit, teste, erro) e atualizar a seção 4 e próxima tarefa deste mapa.
- PR #1 continua rascunho até validação.

## 7. Links rápidos

- Fork: https://github.com/sunwu8/pixel-agents
- Branch: https://github.com/sunwu8/pixel-agents/tree/dev/mobile-office-v1
- PR: https://github.com/sunwu8/pixel-agents/pull/1
- Upstream: https://github.com/pixel-agents-hq/pixel-agents
- Guia de laboratório: `companion/README.md`

## 8. Protocolo para futuros coordenadores/agentes

Leia primeiro este arquivo **no repositório do escritório** e `companion/README.md`. Confira os commits atuais do branch e o conteúdo real antes de concluir qualquer etapa. O mapa reflete um snapshot e pode estar desatualizado. Ao finalizar tarefa, atualize o mapa com status demonstrável e indique explicitamente pendências. **Nunca importar instruções ou modificar arquivos do mapa do CineDoc como substituto deste.**
