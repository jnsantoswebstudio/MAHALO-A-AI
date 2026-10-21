# Checagens da versão 3

Data: 21/10/2026. Execução com Chromium, carregando os mesmos HTML/CSS/JS da distribuição em contexto de prévia local e bloqueando downloads de imagens de terceiros.

- [x] Catálogo: 9 produtos visíveis, filtros e busca.
- [x] Seleção: modal de produto, 6 complementos, quantidades e carrinho.
- [x] Carrinho: açaí 250ml com tâmara e 1 farofa: R$ 17,97 (dentro dos 2 gratuitos).
- [x] Regra de extras: 3 farofas + 1 banana = subtotal mínimo R$ 19,96, com 1 extra pendente de valor.
- [x] Bebidas: suco 300ml aberto sem complementos e adicionado ao carrinho a R$ 14,91.
- [x] Montador: chips/imagens dos complementos confinados visualmente ao interior do copo.
- [x] Painel admin: carregamento de 9 produtos, adição de novo produto, exportação de `site-data.js` com alteração editada.
- [x] Resolução 1440px e 390px: sem rolagem horizontal e sem erros JavaScript encontrados nas ações testadas.
- [x] Sintaxe JS dos arquivos executáveis verificada em Node.js.

Não foi possível verificar neste ambiente o carregamento HTTP das imagens externas `client-assets.anota.ai`; o navegador de teste usa fallback visual e a URL informada permanece na configuração. Não é validação de pedidos reais, entrega, estoque, preço atual da loja ou autenticação de um CMS online.

## Atualização visual do montador (V2 clássico)
- Ícones visuais clássicos da V2 restaurados no painel de ingredientes e dentro do copo.
- Dados, preços, carrinho e painel administrativo da V3 preservados.
- Teste em Chromium com 6 complementos: 4 ícones no copo, somatório visível e item inserido no carrinho no desktop.
- Teste em Chromium no celular (390px): 3 ícones no copo, sem rolagem horizontal e sem erro JavaScript.
- Imagens externas Anota AI podem não carregar durante testes offline; o cardápio e suas URLs permanecem no projeto.

## Revisão adicional antes de apresentação
- Configuração de galeria e copo agora referencia as imagens editáveis no `site-data.js` (inspeção do código).
- Campo de URL do mapa incorporado adicionado no editor.
- Execução no Chromium com HTML/CSS/JS incorporados: **desktop aprovado** para catálogo de 9 produtos, 6 complementos, montador, carrinho e carregamento do painel, sem erro JavaScript observado.
- Verificação do pacote ZIP: integridade aprovada; arquivos do editor, site, workflow e guia de acesso presentes.
- Os testes com navegação HTTP e o download de arquivo no navegador automatizado foram limitados pela política de acesso local neste ambiente. A exportação continua implementada no editor; seu teste ponta a ponta deve ser repetido no navegador usado para publicar.
- A versão anterior já havia passado a checagem mobile, mas esta revisão específica não concluiu a bateria completa de regressão mobile.
