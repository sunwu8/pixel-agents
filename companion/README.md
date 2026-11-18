# Escritório dos Agentes — laboratório mobile (V1 / etapa 1)

Protótipo **experimental** para celular, independente da aplicação principal Pixel Agents.

## O que foi implementado
- Uma tela responsiva, utilizável em Android no modo horizontal ou vertical.
- Escritório ilustrativo com três personagens selecionáveis, cartões de função e movimentos de demonstração.
- Registro de eventos **explicitamente fictícios**, com controles de pausar e reiniciar.
- Código HTML/CSS/JavaScript sem bibliotecas adicionais.

## O que ainda não foi implementado
- O protótipo **não** conecta com Antigravity, Claude Code, Codex ou ChatGPT.
- **Não** mostra atividade real de agentes ou do GitHub; os estados são simulações visuais.
- Não foi implantado publicamente nem testado num Android físico.
- Esta tela ainda não reaproveita os sprites do Pixel Agents original; isso deve ser feito na integração com a UI existente.

## Teste
Abra `companion/index.html` em um navegador moderno ou sirva esse diretório com um servidor HTTP local. A tela não requer login porque usa apenas dados fictícios.

## Próximos marcos
1. Reutilizar o renderer, os sprites e o layout editor originais na experiência mobile.
2. Criar um backend autenticado e **somente leitura** para eventos do GitHub privado, sem jamais enviar tokens ao cliente.
3. Normalizar os eventos de GitHub Actions, commits e status de agentes, distinguindo `unknown`, `idle`, `busy` e `blocked`; não assumir que ausência de eventos significa ocioso.
4. Investigar integração específica com Antigravity CLI e Codex somente após verificar interfaces reais disponíveis.
5. Proteger acesso remoto, validar em Android e rodar testes/CI antes de publicar.

Fork baseado em [pixel-agents-hq/pixel-agents](https://github.com/pixel-agents-hq/pixel-agents), licença MIT. Não alterar CineDoc-Engine.
