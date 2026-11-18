# MAPA DE CONTINUIDADE — ESCRITÓRIO DOS AGENTES

**Projeto:** Escritório dos Agentes / Pixel Agents Mobile
**Data da última revisão:** 2026-11-18
**Repositório:** `sunwu8/pixel-agents` (fork do `pixel-agents-hq/pixel-agents`)
**Branch de trabalho:** `dev/mobile-office-v1`
**PR de acompanhamento:** https://github.com/sunwu8/pixel-agents/pull/1 (rascunho)
**Status:** Protótipo experimental + primeira integração no menu mobile original; workflow de validação enviado, sem resultados confirmados; NÃO implantado e NÃO validado em Android.
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

### Etapa 3 — Primeira integração na interface original (2026-11-18)
- `webview-ui/src/mobile/PublicGitHubActivity.tsx`: componente React de consulta somente leitura a commits públicos da branch do escritório, com tratamento de falhas e botão de atualização.
- `webview-ui/src/mobile/MobileMenu.tsx`: componente instalado no **menu mobile original**, que usa `OfficeCanvas` e motor gráfico originais. A implementação foi enviada ao GitHub; **compilação e teste mobile não executados**.
- O editor e renderizador pixel art continuam os originais; a versão `companion/` permanece laboratório separado e não é a tela principal.
- O feed público é um passo de observabilidade, **não** integração com agentes ou o GitHub privado.

### Etapa 4 — CI da branch mobile (2026-11-18)
- Criado `.github/workflows/office-mobile-v1.yml`, acionado por push em `dev/mobile-office-v1` com mudanças em `webview-ui`, `companion`, pacote ou workflow; oferece `workflow_dispatch`.
- Pipeline executa `npm ci`, geração de mensagens AsyncAPI, verificação de tipos, lint, testes do webview e compilação do webview em Node definido por `.nvmrc`.
- O workflow foi **enviado** ao repositório, mas seu acionamento e aprovação **não foram confirmados**. Conferir Actions antes de afirmar sucesso; o GitHub pode bloquear workflows novos em forks até habilitação.

### Etapa 5 — auditoria CI e usabilidade mobile (2026-11-18)
- Workflow `CI` do PR detectado realmente em execução: https://github.com/sunwu8/pixel-agents/actions/runs/44265736482 ; no momento da consulta estava `in_progress`, inclusive jobs de CI e E2E. **Não declarar aprovado até conclusão**.
- Ajustado `webview-ui/src/mobile/PublicGitHubActivity.tsx` para painel de GitHub **recolhido por padrão**, com `aria-expanded` e consulta apenas após abrir, a fim de poupar espaço no menu mobile.
- Validação desse ajuste via CI/Android ainda pendente; manter estado de testes não confirmados.

### Etapa 6 — execução de CI e correção de formatação do feed (2026-11-18)
- Verificada execução real de CI do fork: run `44265736482` (diversos jobs cancelados; não significa que os testes passaram). Verificada execução posterior `44265968687` inicialmente pendente. Evidência: GitHub Actions.
- Corrigido em `webview-ui/src/mobile/PublicGitHubActivity.tsx` o separador de linhas da mensagem do commit: agora usa quebra de linha real, em vez de buscar texto literal `\\n`.
- Não confirmar compilação ou testes aprovados sem novo resultado explícito. Alterações permanecem em branch isolada, PR #1 em rascunho.

### Etapa 7 — testes específicos do feed (2026-11-18)
- Revisado CI na execução `44266080659`, registrada como `pending` no momento da consulta; não foi confirmada aprovação. O acesso usado para listar runs associados ao commit pode não incluir todos os workflows push.
- Criado `webview-ui/src/mobile/publicGithubCommits.ts`: valida payloads recebidos da API pública, restringe URLs ao fork e verifica correspondência entre URL e SHA; extrai título da primeira linha.
- `PublicGitHubActivity.tsx` utiliza esse parser, substituindo lógica dispersa.
- Criado `webview-ui/test/publicGithubCommits.test.ts` com **cinco testes de código** sobre commits válidos, URLs maliciosas/divergentes, payload inválido, mensagens multilinha e fallback SHA. **A execução desses testes ainda não foi confirmada.**
- Preservado fork público em somente leitura no navegador; nenhuma credencial, acesso privado ou controle de agentes foi adicionado.

### Etapa 8 — diagnóstico da CI com logs (2026-11-18)
- Run de CI `44266265214` confirmado; compilação, typecheck e testes do webview aprovados nos passos observados; o job principal falhou no gate por **lint** (simple-import-sort/imports em `PublicGitHubActivity.tsx`) e **Prettier format:check** no mesmo arquivo. Havia também vulnerabilidades de dependências no audit (aviso não bloqueante). O job de pacote Node 20 falhou durante `npm pack`, que aciona o lint. Outros E2E precisam de verificação separada.
- Commit posterior ajustou ordem de imports e formatação de `PublicGitHubActivity.tsx` para tentar sanar lint e Prettier. **Novo CI ainda não aprovado/confirmado**; verificar no GitHub antes de afirmar correção.
- Próximo marco técnico: obter CI verde, tratar dependências com cuidado sem `npm audit fix --force`, então validar acesso mobile; não publicar credenciais nem expor acesso remoto sem autenticação.

### Etapa 9 — preparação de preview no Android (2026-11-18)
- Criado `.github/workflows/office-companion-preview.yml`: empacota `companion/index.html`, `companion/github-feed.js` e `webview-ui/public/office.png` em um artefato estático e tenta publicar via GitHub Pages na branch de desenvolvimento.
- **Não há URL de Pages verificada ainda.** Pages pode exigir habilitação em Settings > Pages e autorização para workflows Actions. Só informar a URL após deploy e acesso confirmados.
- Essa preview é **apenas o laboratório demonstrativo** de `companion/` e **não é o renderer vivo da aplicação React original**. Não inclui tokens nem mostra o estado real dos agentes.
- CI do commit anterior: execução `44266702807` registrada como `pending` na consulta; conclusão não confirmada.

### Etapa 10 — fallback da demonstração Android (2026-11-18)
- O endereço Pages `https://sunwu8.github.io/pixel-agents/` **não foi confirmado como acessível**. Não informar como link funcionando sem verificação.
- Workflow `.github/workflows/office-companion-preview.yml` atualizado com job `package`: valida e empacota a demonstração em `office-mobile-demo` via `actions/upload-artifact@v4`, independentemente da implantação Pages.
- Job `deploy` separado consome o artefato e tenta GitHub Pages; pode depender de habilitação de Pages em configurações do fork.
- Pacote contém apenas protótipo demonstrativo (`companion/`) e screenshot original; **não** é o motor interativo React, nem conecta agentes reais.
- Código enviado em commit `0d8f2fb`; **execução de workflow, artifact disponível e URL Pages não confirmados nesta etapa**.
- CI run `44266822686` estava `pending` quando consultado. Evitar concluir sucesso sem checks posteriores.

### Etapa 11 — pacote anexado ao CI verificado (2026-11-18)
- A URL GitHub Pages não foi verificada como acessível neste atendimento; não prometer link público.
- No workflow existente `.github/workflows/ci.yml`, que **tem execuções verificadas de pull request**, adicionado job independente `office-mobile-artifact`. Ele monta a demonstração estática usando `companion/index.html`, `github-feed.js` e a imagem `office.png` original; valida arquivos e salva `office-mobile-demo` como artifact (14 dias). Não altera CineDoc.
- Motivo: o workflow de Pages isolado não teve execução/implantação comprovada pelas ferramentas consultadas. O job no CI existente reduz dependência do Pages e permite verificar o pacote na aba Actions do PR.
- **É código enviado, não artifact já confirmado.** Conferir a nova execução de CI após o commit `7697f4f` e inspecionar os artefatos do run; não tratar falhas/cancelamentos de outros jobs como sucesso.
- A demonstração offline não é a aplicação React real nem tem agentes conectados. O painel GitHub requer acesso à internet para exibir commits.

### Etapa 12 — verificação do pacote mobile (2026-11-18)
- Consultado o CI run `44267189418` do último commit da etapa 11. Na consulta, status `pending`, lista de jobs vazia e lista de artefatos vazia.
- **Nenhum arquivo `office-mobile-demo` foi confirmado**. Esse resultado não prova falha do empacotamento: a execução ainda não havia começado a reportar jobs.
- Próxima ação: consultar novamente esse run; quando o job `Office mobile demo artifact` aparecer, verificar sua conclusão e o artefato. Se houver falha, ler logs antes de editar.
- Nenhuma alteração foi feita no CineDoc nem na interface nesta etapa.

### Etapa 13 — pacote realmente gerado e inspecionado (2026-11-18)
- Confirmado no GitHub Actions run `44267310221`, job **Office mobile demo artifact** com conclusão `success`.
- Confirmado artefato **`office-mobile-demo`** com ID `14409879737`. ZIP foi baixado e inspecionado: três arquivos, `index.html`, `github-feed.js` e `office.png`; tamanho ZIP aprox. 47 KB.
- **Este ZIP é uma demonstração local HTML** e não a versão com renderer React/servidor e agentes reais. O feed GitHub depende de internet.
- O CI geral desse run mostrou falhas nos jobs `CI` e `npm Package Smoke`; E2E estavam em andamento na consulta. Não afirmar suite verde.
- Entregue ZIP na conversa, sem afirmar implantação Pages ou teste em Android. Prioridade seguinte: teste mobile com usuário e avaliação de alternativa de deploy da UI original.

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
| Renderer pixel art original no mobile | JÁ EXISTIA NO UPSTREAM | `webview-ui/src/office/components/OfficeCanvas.tsx` e `mobile/MobileShell.tsx`; falta testar no Android |
| Feed no menu original | CÓDIGO ENVIADO | `PublicGitHubActivity.tsx` + `MobileMenu.tsx`; painel recolhível, build/teste pendentes |
| Workflow de qualidade mobile | CÓDIGO ENVIADO | `.github/workflows/office-mobile-v1.yml`; execução e resultado não confirmados |
| Personagens com estados reais Antigravity | PENDENTE | Integrar eventos verificáveis |
| Feed de GitHub privado | PENDENTE | Backend autenticado |
| Integração Antigravity/Claude | PENDENTE | Verificar evento/provider disponível |
| Acesso Android e deploy | ZIP DEMO GERADO | Artifact `14409879737` confirmado; Pages e app original não publicados/verificados |
| Aprovações remotas de agentes | FORA DA V1 | Exige integração e permissões explícitas |

## 5. Próxima tarefa prioritária

**Pacote `office-mobile-demo` confirmado e entregue. Próxima prioridade: testar a demonstração no Android e preparar acesso autenticado à interface React original, sem confundir demo HTML com renderer completo.** O upstream **já tem** `OfficeCanvas`, `MobileShell`, gestos e renderização. Não duplicar o motor em `companion/`. Próxima tarefa: verificar a execução e corrigir falhas do workflow de CI mobile; em seguida, teste de navegação no browser/Android. Verificar layout do painel em aparelhos pequenos, sobretudo altura do menu. Depois integrar estados reais por provedor autenticado.

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
